class Node {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.visited = false;
    this.color = color(255); // color blanco por defecto
  }

  show() {
    fill(this.color);

    rect(this.x, this.y, this.size, this.size);
  }

  isMouseOver(x, y) {
    return (
      x > this.x &&
      x < this.x + this.size &&
      y > this.y &&
      y < this.y + this.size
    );
  }
  getIndex() {
    return [Math.floor(this.y / nodeSize), Math.floor(this.x / nodeSize)];
  }
}
