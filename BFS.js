//Este código implementa el algoritmo de búsqueda en amplitud (BFS) 
//para encontrar el camino más corto entre dos nodos en un grafo. 
//Utiliza una cola para mantener un seguimiento de los nodos a visitar 
//y un conjunto para mantener un seguimiento de los nodos visitados. 
//También utiliza un mapa para mantener un seguimiento de los padres 
//de cada nodo visitado para reconstruir el camino más corto una vez que se encuentra el nodo objetivo. 
//Además, utiliza un tiempo de espera de 1 segundo para que el proceso de búsqueda sea más visible en la pantalla.

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
        currentNode.color = color(200, 255, 170);
        start.color = color(0, 255, 0);
        let neighbors = getNeighbors_bfs(currentNode);
        for (let neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
            parentMap.set(neighbor, currentNode);
            neighbor.color = color(185, 250, 255);
          }
        }
        setTimeout(visitNextNode, delay);
      } else {
        console.log("Nodo objetivo no encontrado.");
      }
    }
  
    setTimeout(visitNextNode, delay);
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