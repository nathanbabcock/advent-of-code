import chalk from 'chalk'
import { Library } from './library'
import { Op } from './op'
import { combinations, eq, prettyPrint } from './util'

const warn_duplicate = false

/**
 * A node in the graph, corresponding to exactly one unique value (of any type).
 * Connected to other specific Values by one or more directed Arrows.
 */
export class Value {
  constructor(
    public value: any,
    public inArrows: Arrow[] = [],
    public outArrows: Arrow[] = [],
  ) { }

  /**
   * Traverse up to the root of the tree.
   * ⚠ Warning: Graph may be cyclic
   */
  getRoot(): Value {
    let cur: Value = this
    while (cur.inArrows.length > 0) cur = cur.inArrows[0].inputs[0]
    return cur
  }

  /** Depth-first in-order traversal of the sub-graph. ⚠ Beware of cycles. */
  traverse(callback: (node: Value) => void) {
    callback(this)
    for (const arrow of this.outArrows) {
      if (arrow.inputs.includes(arrow.output)) continue
      // ⚠ Aborts shallow cycles
      // Indirect cycles can still happen!

      arrow.output.traverse(callback)
    }
  }

  /** Returns a list of every Value discovered in this Digraph */
  collectValues(): Set<Value> {
    const values = new Set<Value>()
    this.getRoot().traverse(node => values.add(node))
    return values
  }

  /** Returns all Values and Arrows */
  collect(): { values: Set<Value>, arrows: Set<Arrow> } {
    const set = { values: new Set<Value>(), arrows: new Set<Arrow>() }
    this.getRoot().traverse(node => set.values.add(node) && node.outArrows.forEach(a => set.arrows.add(a)))
    return set
  }

  /**
   * Check if the current node has an outgoing Arrow with the exact same Op and
   * binding positions.
   * 
   * ⚠ Warning: Copilot helped write this function 🥽
   */
  getOutArrow(op: Op, bindings: Value[]): Arrow | undefined {
    for (const arrow of this.outArrows) {
      if (arrow.op !== op) continue // ❕ comparison by reference
      if (arrow.inputs.length !== bindings.length) continue
      if (arrow.inputs.every((input, i) => eq(input.value, bindings[i].value))) return arrow
    }
    return undefined
  }

  /** Retrieves an existing Value node for the given value, or creates one if needed */
  allocateValue(value: any): Value {
    let outputValue: Value | undefined
    this.getRoot().traverse(node => eq(node.value, value) && (outputValue = node))
    return outputValue ?? new Value(value)
  }

  /**
   * Creates a new "generation" of derived Values by applying Op in the
   * Library, with every combination of parameter bindings, and adding Arrows
   * to connect the results.
   */
  makeChildren(library: Library, callback: MakeChildrenCallback) {
    const ops = library.getOps()

    // Only use Values that existed before this function was called
    let frozenValues = [...this.getRoot().collectValues()]
    // ❕ optimization: enforce that only leaf nodes are used in the binding 
    // (otherwise, it's redundant and will probably trigger the warning case
    // in `hasOutArrow`) This might have unintended consequences...
    // .filter(v => v.outArrows.length === 0 || v.inArrows.length === 0)
    // allow root nodes to be re-used (also causes redundant applications of
    // the input root, but that's okay...)

    for (const op of ops) {
      // Find all compatible values in the graph
      const parameterBindings = op.type.parameters().items.map((param, i) => {
        const possibleBindings: Value[] = []
        frozenValues.filter(node => param.safeParse(node.value).success)
          .forEach(value => possibleBindings.push(value))

        // Append any values recommended by `paramHints`
        const hints = op.paramHints?.[i]?.(undefined).map(this.allocateValue.bind(this)) ?? []
        possibleBindings.push(...hints)
        return possibleBindings
      })

      // Then try every combination of bindings for them
      const bindings: Value[][] = combinations(parameterBindings)
      for (const binding of bindings) {
        // To be extra safe, check for pre-existing Arrow with this binding
        let existingArrow = binding[0].getOutArrow(op, binding)
        if (existingArrow) {
          if (warn_duplicate) console.warn(chalk.gray(`Duplicate arrow: ${existingArrow.toString()}`))
          continue
        }

        // Determine output and (al)locate a Value node for it
        const output = op.impl(...binding.map(b => b.value))
        let outputValue = this.allocateValue(output)
        let novel = outputValue.inArrows.length === 0
        const newArrow = new Arrow(op, binding, outputValue)

        // Connect the new Arrow to the graph
        binding.forEach(input => input.outArrows.push(newArrow))
        outputValue.inArrows.push(newArrow)

        // Callback
        if (callback?.(outputValue, newArrow, novel)) return
      }
    }
  }

  /**
   * Returns a unique derivation from the root Value to this Value,
   * to be used as a template Program for other input/output pairs.
   */
  getDerivationSubgraph(): Value {
    const clone = new Value(this.value)

    // Base case (reached a root node)
    if (this.inArrows.length === 0) return clone

    // Choose a single derivation path to follow
    const arrow = this.inArrows[0]
    const clonedArrow = new Arrow(arrow.op, [], clone)
    clonedArrow.inputs = arrow.inputs.map(input => input.getDerivationSubgraph())
    clone.inArrows = [clonedArrow]
    clonedArrow.inputs.forEach(input => input.outArrows.push(clonedArrow))

    return clone
  }

  /**
   * Modify the value stored in this node, and propagate the changes to all
   * downstream/derived Values.
   * 
   * NB: After calling this function, it is no longer guaranteed that Value nodes
   * are unique (although they will still be correct, just possible redundant).
   */
  applyValue(value: any) {
    this.value = value
    for (const outArrow of this.outArrows) {
      const newOutputValue = outArrow.op.impl(
        ...outArrow.inputs.map(input => input.value)
        // one of these inputs is the value we just updated;
        // others are unchanged (or already derived from the updated one)
        // Independent inputs, like literals, remain unchanged by this application
      )
      outArrow.output.applyValue(newOutputValue)
    }
  }

  toStringShallow() {
    return chalk.yellow(prettyPrint(this.value))
  }

  toStringDerivation(): string {
    if (this.inArrows.length === 0) return this.toStringShallow()
    return this.inArrows.map(a => a.toString()).join(chalk.gray('\n  = '))
  }

  toString(): string {
    const isLeaf = this.outArrows.length === 0
    const isRoot = this.inArrows.length === 0
    let prefix = `${isRoot ? '🌱 ' : ''}${this.toStringShallow()}`
    if (isRoot) return prefix
    return `${prefix} ${chalk.gray('=')} ${this.toStringDerivation()}${isLeaf && !isRoot ? ' 🍃' : ''}`
  }
}

/**
 * Represents a function (of one or more parameters) acting on a Value,
 * transforming it to another Value (or back to itself).
 * 
 * It's an directed edge in the Digraph, but with a twist: it can connect to one
 * or more inputs at the same time, combining them to connect to a single output.
 */
export class Arrow {
  constructor(
    /** The function to be applied to the inputs in order to produce the output */
    public op: Op,

    /** One or more Values to use as inputs for the ops */
    public inputs: Value[],

    /** A single Value, resulting from calling the Op with the inputs */
    public output: Value,
  ) { }

  /** Example: `add(0, 1) = 1` */
  toStringShallow() {
    return `${chalk.magenta(this.op.name)}(${this.inputs.map(i => i.toStringShallow()).join(', ')}) = ${this.output.toStringShallow()}`
  }

  /** Example: `add(input1(0), input2(1)) = 1` */
  toString() {
    return `${chalk.magenta(this.op.name)}(${this.inputs.map(i => {
      if (this.inputs.includes(i) || this.output === i)
        return i.toStringShallow()
      return i.toStringDerivation()
    }).join(', ')})`
  }
}

export type MakeChildrenCallback = (value: Value, arrow: Arrow, novel: boolean) => void | true