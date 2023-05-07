p5.disableFriendlyErrors = true; // disables FES
let grid = [];
let nodeSize;
let numRows;
let numCols;
let start = null;
let end = null;
let firstClick = true;
let secondClick = false;
let search_button;

function setup() {
  createCanvas(300, 300);
  nodeSize = 30;
  numRows = Math.ceil(height / nodeSize);
  numCols = Math.ceil(width / nodeSize);

  // crea la matriz de objetos Node
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }
  textAlign(CENTER);
  sel = createSelect();
  sel.position(10,10);
  sel.option('Best-first-search');
  sel.option('A*');
  // Presionar para buscar
  search_button = createButton("Search");
  search_button.mousePressed(searching_end);
  search_button.attribute('disabled', '');
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
      start.color = color(135, 206, 250); // azul claro
      start.visited = false;
    }
    firstClick = false;
    secondClick = true;
  } else if (secondClick) {
    const i = Math.floor(mouseY / nodeSize);
    const j = Math.floor(mouseX / nodeSize);
    end = grid[i][j];
    if (end != null) {
      end.visited = false;
      end.color = color(135, 206, 250); // azul claro
    }
    secondClick = false;
    search_button.removeAttribute('disabled');
  } else {
    // Comprueba si se hizo clic en un nodo y elimínalo
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const node = grid[i][j];
        if (
          node != start &&
          node != end &&
          node != null &&
          node.isMouseOver(mouseX, mouseY)
        ) {
          grid[i][j] = null;
        }
      }
    }
  }
}

function mouseDragged() {
  // Comprueba si el mouse está sobre un nodo y elimínalo mientras se arrastra
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const node = grid[i][j];
      if (
        node != start &&
        node != end &&
        node != null &&
        node.isMouseOver(mouseX, mouseY)
      ) {
        grid[i][j] = null;
      }
    }
  }
}

function getNeighbors(node) {
  const neighbors = [];
  const numRows = grid.length;
  const numCols = grid[0].length;
  const row = node.y / nodeSize;
  const col = node.x / nodeSize;
  
  // Verificar los vecinos en las 8 direcciones posibles
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      // Omitir la posición actual
      if (i === row && j === col) continue;
      // Verificar si el vecino está dentro de la matriz
      if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
        const neighbor = grid[i][j];
        // Verificar si el vecino es diferente de null o si su atributo visited es false
        if (neighbor !== null) {
          neighbors.push(neighbor);
        }
      }
    }
  }
  return neighbors;
}


function searching_end(){
  switch (sel.value()) {
    case 'Best-first-search':
      bfs(start, end);
      break;
    case 'Best-first-search':
      dijkstra(start, end);
      break;
    default:
      break;
  }
  
}

function bfs(startNode, targetNode) {
  let queue = [];
  queue.push(startNode);

  let visited = new Set();
  visited.add(startNode);

  let parentMap = new Map();
  parentMap.set(startNode, null);

  let delay = 100; // tiempo de espera de 1 segundo
  let currentNode;

  function visitNextNode() {
    if (queue.length > 0) {
      currentNode = queue.shift();
      if (currentNode === targetNode) {
        // Se encontró el nodo objetivo
        let path = [currentNode];
        let parent = parentMap.get(currentNode);
        while (parent !== null) {
          path.unshift(parent);
          parent = parentMap.get(parent);
        }
        console.log("Camino encontrado: ", path);
        return;
      }
      currentNode.visited = true;

      let neighbors = getNeighbors(currentNode);
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          parentMap.set(neighbor, currentNode);
        }
      }

      setTimeout(visitNextNode, delay);
    } else {
      console.log("Nodo objetivo no encontrado.");
    }
  }

  setTimeout(visitNextNode, delay);
}


function dijkstra(){
  // ...
}


function print(x){console.log(x);}

