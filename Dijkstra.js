// Esta función implementa el algoritmo de Dijkstra para encontrar el camino más corto
// entre dos nodos en un grafo.
// El algoritmo utiliza una lista de nodos sin visitar y una lista de nodos 
// visitados para encontrar el camino. En cada iteración, se selecciona el nodo sin visitar con la distancia más pequeña 
// y se exploran todos sus vecinos. Si el vecino no ha sido visitado antes, se calcula el costo del movimiento y se añade a la lista de nodos sin visitar.
// Si el vecino ya está en la lista de nodos sin visitar, se compara el costo del nuevo camino con el costo anterior y se actualiza si es mejor. Si el nodo actual es el nodo objetivo, se 
// encuentra el nodo objetivo, la función devuelve una lista vacía.


function dijkstra(startNode, endNode) {
    let unvisitedNodes = [startNode];
    let visitedNodes = [];
    startNode.distance = 0;
  
    while (unvisitedNodes.length > 0) {
      let currentNode = unvisitedNodes[0];
  
      // Encontrar el nodo sin visitar con la menor distancia
      for (let i = 1; i < unvisitedNodes.length; i++) {
        if (unvisitedNodes[i].distance < currentNode.distance) {
          currentNode = unvisitedNodes[i];
        }
      }
  
      // Si el nodo actual es el nodo objetivo, hemos encontrado el camino
      if (currentNode === endNode) {
        let path = [];
        let current = currentNode;
        while (current.parent) {
          current.color = color(185, 250, 255);
          path.push(current);
          current = current.parent;
        }
        path.push(startNode);
        startNode.color = color(0, 255, 0);
        endNode.color = color(255, 0, 0);
        console.log("Camino encontrado: ", path);
        final_path = path.reverse();
        return path.reverse();
      }
  
      // Mover el nodo actual de la lista sin visitar a la lista visitada
      unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
      visitedNodes.push(currentNode);
  
      // Encontrar los vecinos del nodo actual
      let neighbors = getNeighbors(currentNode);
      for (let neighbor of neighbors) {
        // Si el vecino ya está en la lista visitada, saltarlo
        if (visitedNodes.includes(neighbor)) {
          continue;
        }
  
        // Calcular el costo del movimiento hacia el vecino
        let tentativeDistance = currentNode.distance + 1; // En este caso, el costo de movimiento es 1 para todos los vecinos
        console.log("TentativeDistance",tentativeDistance);
  
        // Si el vecino no está en la lista sin visitar, añadirlo
        if (!unvisitedNodes.includes(neighbor)) {
          unvisitedNodes.push(neighbor);
        } else if (tentativeDistance >= neighbor.distance) {
          // Si el vecino ya está en la lista sin visitar y el nuevo camino no es mejor, saltarlo
          continue;
        }
  
        // Este camino es el mejor hasta ahora, guardar información sobre el vecino
        neighbor.parent = currentNode;
        neighbor.distance = tentativeDistance;
        neighbor.color = color(200, 255, 170);
      }
    }
  
    console.log("Nodo objetivo no encontrado.");
    return [];
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