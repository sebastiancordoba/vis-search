let gen_slider;

function genetic(startNode, endNode, pobSize) {
  genetic_pob = [];
  genetic_fitness = [];
  genetic_dna = [];
  gen_slider = createButton("Gen");
  gen_slider.position(10, 160);
  gen_slider.mousePressed(generar);
  const x = startNode.y / nodeSize;
  const y = startNode.x / nodeSize;

  for (let i = 0; i < pobSize; i++) {
    let dna = randomDNA(15);
    genetic_dna.push(dna);
    let path = show_genetic(dna, x, y);
    genetic_pob.push(path);
    let last = path[path.length - 1];
    genetic_fitness.push(distance_last(last, endNode));
    last.color = color(255, 0, 0);
  }

  function generar() {
    for (let n = 0; n < 5; n++) {
      for (let i = 0; i < genetic_pob.length; i++) {
        for (let j = 0; j < genetic_pob[i].length; j++) {
          genetic_pob[i][j].color = color(255, 255, 255);
        }
      }

      bestDNA = indexOfMin(genetic_fitness);
      print(bestDNA);

      for (let i = 0; i < genetic_pob.length; i++) {
        print(genetic_dna[i]);
        newDNA = genetic_dna[bestDNA];
        //newDNA = crossover(genetic_dna[bestDNA], genetic_dna[i]);
        newDNA = mutacion(newDNA);
        print(newDNA);
        genetic_dna[i] = newDNA;
        let path = show_genetic(newDNA, x, y);
        genetic_pob[i] = path;
        let last = path[path.length - 1];
        genetic_fitness[i] = distance_last(last, endNode);
        last.color = color(255, 0, 0);
      }
    }
  }
}

function show_genetic(dna, x, y) {
  let newX = x;
  let newY = y;
  let nodes_visited = [];
  for (let i = 0; i < dna.length; i += 2) {
    let move = dna.substring(i, i + 2);
    let moves = switch_dna_move(move, newX, newY);
    if (moves == -1) {
      break;
    }
    newX = moves[0];
    newY = moves[1];
    copyNode = grid[newX][newY];
    if (copyNode != null) {
      newNode = new Node(copyNode.x, copyNode.y, nodeSize);
      newNode.color = color(0, 255, 0, 100);
      nodes_visited.push(newNode);
    } else {
      break;
    }
  }
  return nodes_visited;
}

function switch_dna_move(move_string, i, j) {
  let newI = i;
  let newJ = j;
  switch (move_string) {
    case "00":
      if (i + 1 < grid.length && grid[i + 1][j] != start) {
        //grid[i + 1][j].color = color(255, 0, 0, 100);
        newI = i + 1;
      }
      break;
    case "11":
      if (i - 1 >= 0 && grid[i - 1][j] != start) {
        //grid[i - 1][j].color = color(255, 0, 0, 100);
        newI = i - 1;
      }
      break;
    case "01":
      if (j + 1 < grid[0].length && grid[i][j + 1] != start) {
        //grid[i][j + 1].color = color(255, 0, 0, 100);
        newJ = j + 1;
      }
      break;
    case "10":
      if (j - 1 >= 0 && grid[i][j - 1] != start) {
        //grid[i][j - 1].color = color(255, 0, 0, 100);
        newJ = j - 1;
      }
      break;
    default:
      break;
  }
  if (newI == i && newJ == j) {
    return -1;
  }
  return [newI, newJ];
}

function randomDNA(n) {
  let cadena = "";
  let ultimaCombinacion = "";
  for (let i = 0; i < n; i++) {
    let combinacion = "";
    do {
      combinacion = generarCombinacion();
    } while (
      (ultimaCombinacion === "00" && combinacion === "11") ||
      (ultimaCombinacion === "11" && combinacion === "00") ||
      (ultimaCombinacion === "01" && combinacion === "10") ||
      (ultimaCombinacion === "10" && combinacion === "01")
    );
    cadena += combinacion;
    ultimaCombinacion = combinacion;
  }
  return cadena;
}

function generarCombinacion() {
  let combinaciones = ["00", "01", "10", "11"];
  let indice = Math.floor(Math.random() * combinaciones.length);
  return combinaciones[indice];
}

function distance(todoPath, endNode) {
  let dis = 0;
  for (let finalPath of todoPath) {
    dis += Math.sqrt(
      Math.pow(finalPath.x - endNode.x, 2) +
        Math.pow(finalPath.y - endNode.y, 2)
    );
  }
  return dis / nodeSize;
}

function distance_last(finalPath, endNode) {
  return Math.sqrt(
    Math.pow(finalPath.x - endNode.x, 2) + Math.pow(finalPath.y - endNode.y, 2)
  );
}

function crossover(dna1, dna2) {
  // Obtener la longitud de las cadenas de ADN
  const len = dna1.length;

  // Obtener el índice de la mitad de las cadenas
  const mid = Math.floor(len / 2);

  // Concatenar la primera mitad de dna1 con la segunda mitad de dna2
  const newDna = dna1.substring(0, mid) + dna2.substring(mid, len);

  return newDna;
}

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
