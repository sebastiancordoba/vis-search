class Node {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.visited = false;
    this.color = color(48, 54, 61, 100); // Darker default for dark mode
  }

  show() {
    stroke(30, 36, 45, 150);
    fill(this.color);
    // Draw with slight rounded corners and border
    rect(this.x, this.y, this.size, this.size, 4);
    
    // Add subtle inner glow if visited
    if (this.visited && this.color.levels[3] > 0) {
      noStroke();
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 50);
      rect(this.x + 2, this.y + 2, this.size - 4, this.size - 4, 3);
    }
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
