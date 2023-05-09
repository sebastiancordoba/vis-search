let gen_slider;
let cromosomas = 30;

function genetic(startNode, endNode, pobSize) {
  gen_slider = createButton("Gen");
  gen_slider.position(10, 160);
  gen_slider.mousePressed(generate);

  // Convertir las coordenadas del nodo inicial al sistema de cuadrícula
  const x = startNode.y / nodeSize;
  const y = startNode.x / nodeSize;

  // Inicializar la población del algoritmo genético con secuencias de ADN aleatorias
  for (let i = 0; i < pobSize; i++) {
    let dna = randomDNA(cromosomas);
    genetic_dna.push(dna);
    let path = show_genetic(dna, x, y);
    genetic_pob.push(path);
    let last = path[path.length - 1];

    // Calcular la aptitud de cada secuencia de ADN en función de la distancia desde el nodo final
    genetic_fitness.push(distance_last(last, endNode));

    // Colorea el último nodo del camino en rojo
    last.color = color(255, 0, 0);
  }
  // Realiza una generación del algoritmo genético cuando se presiona el botón "Gen"
  function generate() {
    // Restablecer los colores de todos los nodos en la población
    for (let i = 0; i < genetic_pob.length; i++) {
      for (let j = 0; j < genetic_pob[i].length; j++) {
        genetic_pob[i][j].color = color(255, 255, 255);
      }
    }
    // Seleccione la secuencia de ADN con la aptitud (distancia) más baja como padre
    bestDNA = indexOfMin(genetic_fitness);

    // Generar una nueva población mediante mutación en la secuencia de ADN original
    for (let i = 0; i < genetic_pob.length; i++) {
      newDNA = genetic_dna[bestDNA];
      newDNA = mutacion(newDNA);
      genetic_dna[i] = newDNA;
      let path = show_genetic(newDNA, x, y);
      genetic_pob[i] = path;
      let last = path[path.length - 1];

      // Recalcular la aptitud de cada secuencia de ADN en función de la distancia desde el nodo final
      genetic_fitness[i] = distance_last(last, endNode);

      // Colorea el último nodo del camino en rojo
      last.color = color(255, 0, 0);
    }
  }
}

// Dada una secuencia de ADN y las coordenadas iniciales, devuelve la ruta que genera
function show_genetic(dna, x, y) {
  let newX = x;
  let newY = y;
  let nodes_visited = [];
  for (let i = 0; i < dna.length; i += 2) {
    let move = dna.substring(i, i + 2);

    // Calcular las nuevas coordenadas basadas en el movimiento codificado en la secuencia de ADN
    let moves = switch_dna_move(move, newX, newY);
    if (moves == -1) {
      break;
    }
    newX = moves[0];
    newY = moves[1];

    // Agregar un nuevo nodo a la ruta si existe en la grilla
    copyNode = grid[newX][newY];
    if (copyNode != null) {
      newNode = new Node(copyNode.x, copyNode.y, nodeSize);
      newNode.color = color(100, 255, 85, 100);
      nodes_visited.push(newNode);
    } else {
      break;
    }
  }
  return nodes_visited;
}

// Función para mover una celda en el grid basado en una cadena de movimiento
function switch_dna_move(move_string, i, j) {
  let newI = i;
  let newJ = j;

  // Verifica la cadena de movimiento y actualiza la posición de la celda
  switch (move_string) {
    case "00":
      if (i + 1 < grid.length && grid[i + 1][j] != start) {
        newI = i + 1;
      }
      break;
    case "11":
      if (i - 1 >= 0 && grid[i - 1][j] != start) {
        newI = i - 1;
      }
      break;
    case "01":
      if (j + 1 < grid[0].length && grid[i][j + 1] != start) {
        newJ = j + 1;
      }
      break;
    case "10":
      if (j - 1 >= 0 && grid[i][j - 1] != start) {
        newJ = j - 1;
      }
      break;
    default:
      break;
  }

  // Si la celda no cambió de posición, retorna -1
  if (newI == i && newJ == j) {
    return -1;
  }

  // Retorna las nuevas coordenadas de la celda
  return [newI, newJ];
}

// Función para generar una cadena de ADN aleatoria de longitud n
function randomDNA(n) {
  let cadena = "";
  let ultimaCombinacion = "";
  for (let i = 0; i < n; i++) {
    let combinacion = "";

    // Genera una nueva combinación hasta que no sea igual a la combinación anterior
    do {
      combinacion = generarCombinacion();
    } while (
      (ultimaCombinacion === "00" && combinacion === "11") ||
      (ultimaCombinacion === "11" && combinacion === "00") ||
      (ultimaCombinacion === "01" && combinacion === "10") ||
      (ultimaCombinacion === "10" && combinacion === "01")
    );
    // Agrega la nueva combinación a la cadena de ADN
    cadena += combinacion;
    ultimaCombinacion = combinacion;
  }
  // Retorna la cadena de ADN generada
  return cadena;
}

// Función para generar una combinación de dos bits aleatoria
function generarCombinacion() {
  let combinaciones = ["00", "01", "10", "11"];
  let indice = Math.floor(Math.random() * combinaciones.length);
  return combinaciones[indice];
}

// Función para calcular la distancia entre un nodo y el nodo final
function distance_last(finalPath, endNode) {
  return Math.sqrt(
    Math.pow(finalPath.x - endNode.x, 2) + Math.pow(finalPath.y - endNode.y, 2)
  );
}

// Regresa el indice del elemento mínimo del arreglo
function indexOfMin(arr) {
  return arr.indexOf(Math.min(...arr));
}

function mutacion(adn) {
  // Convertir la cadena a un array para poder modificarla
  let adnArray = adn.split("");

  // Calcular la probabilidad de mutación (10%)
  const probabilidadMutacion = 0.2;

  // Seleccionar un índice aleatorio del array de ADN
  const indiceMutacion = Math.floor(Math.random() * adnArray.length);

  // Si se cumple la probabilidad de mutación, cambiar el caracter en el índice seleccionado
  if (Math.random() < probabilidadMutacion) {
    // Si el caracter es 0, cambiarlo a 1, y viceversa
    if (adnArray[indiceMutacion] === "0") {
      adnArray[indiceMutacion] = "1";
    } else {
      adnArray[indiceMutacion] = "0";
    }
  }

  // Unir el array mutado en una nueva cadena y devolverla
  return adnArray.join("");
}
