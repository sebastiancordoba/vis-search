let grid = [];
let nodeSize;
let numRows;
let numCols;
let start = null;
let end = null;
let firstClick = true;
let secondClick = false;

function setup() {
  createCanvas(600, 600);
  nodeSize = 20;
  numRows = Math.ceil(height / nodeSize);
  numCols = Math.ceil(width / nodeSize);

  // crea la matriz de objetos Node
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }
}

function draw() {
  background(0);

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] != null) {
        grid[i][j].show();
      }
    }
  }
}

function mousePressed() {
  if (firstClick) {
    // Obtén el nodo sobre el que se hizo clic y asígnalo a la variable start
    const i = Math.floor(mouseY / nodeSize);
    const j = Math.floor(mouseX / nodeSize);
    start = grid[i][j];
    if (start != null) {
      start.visited = true;
      start.color = color(135, 206, 250); // azul claro
    }
    firstClick = false;
    secondClick = true;
  } else if (secondClick){
      const i = Math.floor(mouseY / nodeSize);
    const j = Math.floor(mouseX / nodeSize);
    end = grid[i][j];
    if (end != null) {
      end.visited = true;
      end.color = color(135, 206, 250); // azul claro
    }
    secondClick = false;
  } else {
    // Comprueba si se hizo clic en un nodo y elimínalo
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const node = grid[i][j];
        if (node != null && node.isMouseOver(mouseX, mouseY)) {
          grid[i][j] = null;
        }
      }
    }
  }
  let av = getNonVisitedAdjacentNodes(start)
  av[0].visited = true
  console.log(av[0])
}

function mouseDragged() {
  // Comprueba si el mouse está sobre un nodo y elimínalo mientras se arrastra
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const node = grid[i][j];
      if (node != null && node.isMouseOver(mouseX, mouseY)) {
        grid[i][j] = null;
      }
    }
  }
}

function getNonVisitedAdjacentNodes(node) {
  const adjacentNodes = [];

  const row = Math.floor(node.y / nodeSize);
  const col = Math.floor(node.x / nodeSize);

  // Iterate over adjacent nodes
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      // Check if new row and column are within bounds
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        let adjacentNode = grid[newRow][newCol];

        // Check if adjacent node is not null and not visited
        if (adjacentNode != null && !adjacentNode.visited) {
          adjacentNodes.push(grid[newRow][newCol]);
        }
      }
    }
  }

  return adjacentNodes;
}
