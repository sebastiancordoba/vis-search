// La función 'heuristic' calcula la distancia 
// euclidiana entre dos nodos para utilizarla como heurística en el algoritmo A*.
//CREAMOS A*
function heuristic(finalPath, endNode) {
    return Math.sqrt(
      Math.pow(finalPath.x - endNode.x, 2) + Math.pow(finalPath.y - endNode.y, 2)
    );
  }
  
  // La función 'astar' implementa el algoritmo A* para encontrar 
  //el camino óptimo desde el nodo inicial al nodo final en un grid de nodos.
  
  function astar(startNode, endNode) {
    let openList = [startNode];
    let closedList = [];
    startNode.gScore = 0;
    startNode.fScore = heuristic(startNode, endNode);
    endNode.visited = false;
    while (openList.length > 0) {
      let currentNode = openList[0];
  
      // Encontrar el nodo con el menor fScore en la lista abierta
      for (let i = 1; i < openList.length; i++) {
        if (openList[i].fScore < currentNode.fScore) {
          currentNode = openList[i];
        }
      }
  
      // Si el nodo actual es el nodo objetivo, hemos encontrado el camino
      if (currentNode === endNode) {
        let path = [];
        while (currentNode.parent) {
          currentNode.color = color(185, 250, 255);
          path.push(currentNode);
          currentNode = currentNode.parent;
        }
        path.push(startNode);
        startNode.color = color(0, 255, 0);
        endNode.color = color(255, 0, 0);
        console.log("Camino encontrado: ", path);
        new_path = path.reverse();
        final_path = new_path;
        return path.reverse();
      }
  
      // Mover el nodo actual de la lista abierta a la lista cerrada
      openList.splice(openList.indexOf(currentNode), 1);
      closedList.push(currentNode);
  
      // Encontrar los vecinos del nodo actual
      let neighbors = getNeighbors_astar(currentNode);
  
      for (let neighbor of neighbors) {
        // Si el vecino está en la lista cerrada, saltarlo
        if (closedList.includes(neighbor)) {
          continue;
        }
  
        // Calcular el costo del movimiento hacia el vecino
        let tentativeGScore = currentNode.gScore + heuristic(currentNode, neighbor);
  
        // Si el vecino no está en la lista abierta, añadirlo
        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        } else if (tentativeGScore >= neighbor.gScore) {
          // Si el vecino ya está en la lista abierta y el nuevo camino no es mejor, saltarlo
          continue;
        }
  
        // Este camino es el mejor hasta ahora, guardar información sobre el vecino
        neighbor.parent = currentNode;
        neighbor.gScore = tentativeGScore;
        neighbor.fScore = tentativeGScore + heuristic(neighbor, endNode);
        neighbor.color = color(200, 255, 170);
      }
    }
  
    console.log("Nodo objetivo no encontrado.");
    return [];
  }
  // La función 'getNeighbors_astar' devuelve una lista de los vecinos
  // del nodo dado para ser utilizada en el algoritmo A*.
  
  
  function getNeighbors_astar(node) {
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