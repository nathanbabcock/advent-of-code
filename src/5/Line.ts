export class Point {
  constructor(public x: number, public y: number) {
    this.x = x
    this.y = y
  }

  static fromArray(arr: [number, number]) {
    return new Point(arr[0], arr[1])
  }

  static getMax(points: Point[]): Point {
    const x = points.map(point => point.x)
    const y = points.map(point => point.y)
    return new Point(Math.max(...x), Math.max(...y))
  }
}

export class Line {
  constructor(public a: Point, public b: Point) {
    this.a = a
    this.b = b
  }

  getPoints(): Point[] {
    const points = []
    if (this.a.x === this.b.x)
      for (let y = Math.min(this.a.y, this.b.y); y <= Math.max(this.a.y, this.b.y); y++)
        points.push(new Point(this.a.x, y))
    else if (this.a.y === this.b.y)
      for (let x = Math.min(this.a.x, this.b.x); x <= Math.max(this.a.x, this.b.x); x++)
        points.push(new Point(x, this.a.y))
    // else console.warn('Line is not a horizontal or vertical line')
    return points
  }

  static fromArray(arr: [Point, Point]) {
    return new Line(arr[0], arr[1])
  }

  static getMax(lines: Line[]): Point {
    const points = lines.flatMap(line => line.getPoints())
    return Point.getMax(points)
  }
}