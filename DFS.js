// La función depth implementa la búsqueda en profundidad para encontrar un camino desde el nodo de inicio al nodo objetivo.
// Utiliza una pila para almacenar los nodos a visitar.
// El algoritmo comienza visitando el nodo de inicio, y luego visita los vecinos de ese nodo de manera recursiva.
// Si encuentra el nodo objetivo, traza el camino de regreso al nodo de inicio y lo almacena en una lista.
// Devuelve la lista de nodos en orden inverso para que el primer elemento sea el nodo de inicio y el último el nodo objetivo.
function depth(startNode, endNode) {
    let stack = [startNode];
    let path = [];
    let delay = 0; // tiempo de espera de 50 milisegundos
    startNode.visited = true;
    endNode.visited = false;
  
    function visitNextNode() {
      if (stack.length > 0) {
        let currentNode = stack.pop();
        if (currentNode === endNode) {
          while (currentNode.parent) {
            currentNode.color = color(185, 250, 255);
            path.push(currentNode);
            currentNode = currentNode.parent;
          }
          path.push(startNode);
          start.color = color(0, 255, 0);
          end.color = color(255, 0, 0);
          console.log("Camino encontrado: ", path);
          final_path = path;
          return;
        }
  
        let neighbors = getNeighbors_poda(currentNode);
        for (let neighbor of neighbors) {
          if (!neighbor.visited) {
            neighbor.visited = true;
            neighbor.parent = currentNode;
            stack.push(neighbor);
            neighbor.color = color(200, 255, 170);
          }
        }
        setTimeout(visitNextNode, delay);
      } else {
        console.log("Nodo objetivo no encontrado.");
      }
    }
  
  
    setTimeout(visitNextNode, delay);
    return path.reverse();
  }
  
  function getNeighbors_poda(node) {
    const neighbors = [];
    const numRows = grid.length;
    const numCols = grid[0].length;
    const row = node.y / nodeSize;
    const col = node.x / nodeSize;
  
    // Verificar los vecinos en las 4 direcciones posibles (arriba, abajo, izquierda, derecha)
  
    const directions = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ]; // (fila, columna) para cada dirección
    for (let dir of directions) {
      const newRow = row + dir[0];
      const newCol = col + dir[1];
      // Verificar si el vecino está dentro de la matriz
      if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
        const neighbor = grid[newRow][newCol];
        // Verificar si el vecino es diferente de null y si su atributo visited es false
        if (neighbor !== null && !neighbor.visited) {
          neighbors.push(neighbor);
        }
      }
    }
    return neighbors;
  }