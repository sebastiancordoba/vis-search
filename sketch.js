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
let restart_button;
let final_path = [];
let grid_slider;
let noise_slider;
let noise_count = 0;
let noises = [];

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
  // selection
  textAlign(CENTER);
  sel = createSelect();
  sel.position(10, 10);
  sel.option("Best-first-search");
  sel.option("Genetic");
  sel.option("Dijkstra");
  sel.option("A*");
  sel.selected('Genetic');
  // grid Weight
  grid_slider = createSlider(0, 2, 1, 0.05);
  grid_slider.attribute("disabled", "");
  grid_slider.position(10, 40);
  // Presionar para buscar
  search_button = createButton("Search");
  search_button.mousePressed(searching_end);
  search_button.attribute("disabled", "");
  search_button.position(10, 70);
  // Restart
  restart_button = createButton("Restart");
  restart_button.mousePressed(restart_fun);
  restart_button.position(10, 100);
  // noise quantity
  noise_slider = createSlider(0, (width * height) / nodeSize / nodeSize, 0, 1);
  noise_slider.position(10, 130);
  noise_slider.changed(noise_change);
}

function draw() {
  background(0);
  strokeWeight(grid_slider.value());

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] != null) {
        grid[i][j].show();
      }
    }
  }

  for (let i = 0; i < final_path.length - 1; i++) {
    connect_line(final_path[i], final_path[i + 1]);
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
    search_button.removeAttribute("disabled");
    grid_slider.removeAttribute("disabled");
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

function getNeighbors_bfs(node) {
  const rows = grid.length;
  const cols = grid[0].length;
  const x = node.y / nodeSize;
  const y = node.x / nodeSize;
  const neighbors = [];

  // Check horizontal and vertical neighbors
  if (x > 0) neighbors.push(grid[x - 1][y]);
  if (x < rows - 1) neighbors.push(grid[x + 1][y]);
  if (y > 0) neighbors.push(grid[x][y - 1]);
  if (y < cols - 1) neighbors.push(grid[x][y + 1]);

  // Check diagonal neighbors with a penalty
  if (x > 0 && y > 0) neighbors.push(grid[x - 1][y - 1]);
  if (x > 0 && y < cols - 1) neighbors.push(grid[x - 1][y + 1]);
  if (x < rows - 1 && y > 0) neighbors.push(grid[x + 1][y - 1]);
  if (x < rows - 1 && y < cols - 1) neighbors.push(grid[x + 1][y + 1]);

  // Apply diagonal penalty
  for (const neighbor of neighbors) {
    if (neighbor != null) {
      const dx = Math.abs(neighbor.x - x);
      const dy = Math.abs(neighbor.y - y);
      if (dx === 1 && dy === 1) {
        neighbor.cost *= Math.sqrt(2); // Apply diagonal penalty
      }
    }
  }

  return neighbors.filter((neighbor) => neighbor != null && !neighbor.visited);
}

function searching_end() {
  final_path = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] != null && grid[i][j] != start && grid[i][j] != end) {
        grid[i][j].color = color(255, 255, 255);
      }
    }
  }

  switch (sel.value()) {
    case "Best-first-search":
      bfs(start, end);
      break;
    case "Dijkstra":
      dijkstra(start, end);
      break;
    case "Genetic":
      genetic(start, end);
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

  let delay = 0; // tiempo de espera de 1 segundo
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
        final_path = path;
        start.visited = false;
        start.color = color(0, 255, 0);
        end.color = color(255, 0, 0);
        return;
      }
      currentNode.color = color(185, 250, 255);
      start.color = color(0, 255, 0);
      let neighbors = getNeighbors_bfs(currentNode);
      for (let neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          parentMap.set(neighbor, currentNode);
          neighbor.color = color(200, 255, 170);
        }
      }
      setTimeout(visitNextNode, delay);
    } else {
      console.log("Nodo objetivo no encontrado.");
    }
  }

  setTimeout(visitNextNode, delay);
}

function dijkstra(startNode, endNode) {
  let distances = new Map();
  let visited = new Set();
  let previousNodes = new Map();
  let delay = 1000; // tiempo de espera de 1 segundo

  // Inicializamos la distancia a todos los nodos desde el nodo de inicio como infinito.
  for (let row of grid) {
    for (let node of row) {
      distances.set(node, Infinity);
    }
  }

  // La distancia desde el nodo de inicio a sí mismo es 0.
  distances.set(startNode, 0);

  function getClosestNode() {
    let closestNode = null;
    let closestDistance = Infinity;
    for (let [node, distance] of distances) {
      if (!visited.has(node) && distance <= closestDistance) {
        closestNode = node;
        closestDistance = distance;
      }
    }
    return closestNode;
  }

  function visitNextNode() {
    let closestNode = getClosestNode();
    closestNode.color = color(255, 0, 0);
    if (closestNode === endNode) {
      // Se encontró el nodo objetivo
      let path = [closestNode];
      let previous = previousNodes.get(closestNode);
      while (previous !== startNode) {
        path.unshift(previous);
        previous = previousNodes.get(previous);
      }
      path.unshift(startNode);
      console.log("Camino encontrado: ", path);
      return;
    }

    let neighbors = getNeighbors(closestNode);
    for (let neighbor of neighbors) {
      let distance = closestNode.getDistanceTo(neighbor);
      let totalDistance = distances.get(closestNode) + distance;
      if (totalDistance < distances.get(neighbor)) {
        distances.set(neighbor, totalDistance);
        previousNodes.set(neighbor, closestNode);
      }
    }

    visited.add(closestNode);
    setTimeout(visitNextNode, delay);
  }

  setTimeout(visitNextNode, delay);
}

function print(x) {
  console.log(x);
}

function connect_line(s, e) {
  stroke(0);
  strokeWeight(3);
  line(
    s.x + nodeSize / 2,
    s.y + nodeSize / 2,
    e.x + nodeSize / 2,
    e.y + nodeSize / 2
  );
}

function restart_fun() {
  final_path = [];
  grid = [];
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }
}

function noise_change() {
  let value = noise_slider.value();
  if (value > noise_count) {
    for (let i = 0; i < value; i++) {
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid[0].length);
      if (grid[row][col] != start && grid[row][col] != end) {
        noises.push(grid[row][col]);
        grid[row][col] = null;
      }
    }
    print(value);
    noise_count = value;
  } else {
    let n = noises.length - value;
    print(noise_count);
    print(value);
    print(n);
    print(noises.length);
    for (let i = 0; i < n; i++) {
      const x = noises[i].y / nodeSize;
      const y = noises[i].x / nodeSize;
      noises.shift();
      grid[x][y] = new Node(noises[i].x, noises[i].y, nodeSize);
    }
  }
}
