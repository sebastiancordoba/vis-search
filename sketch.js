p5.disableFriendlyErrors = true; // Desactiva los errores amigables
let grid = []; // Declara una matriz vacía
let nodeSize; // Tamaño de cada nodo
let numRows; // Número de filas
let numCols; // Número de columnas
let start = null; // Nodo de inicio
let end = null; // Nodo final
let firstClick = true; // Variable para controlar el primer clic
let secondClick = false; // Variable para controlar el segundo clic
let search_button; // Botón para iniciar la búsqueda
let restart_button; // Botón para reiniciar
let final_path = []; // Camino final encontrado por el algoritmo
let grid_slider; // Slider para ajustar el peso del grid
let noise_slider; // Slider para ajustar la cantidad de ruido
let noise_count = 0; // Contador de ruido
let noises = []; // Array para almacenar los nodos ruidosos
let genetic_pob = []; // Población del algoritmo genético
let genetic_dna = []; // Material genético de la población
let genetic_fitness = []; // Valor de aptitud de cada individuo

function setup() {
  createCanvas(600, 600); // Crea un canvas de 600x600 px
  nodeSize = 30; // Asigna el tamaño de los nodos
  numRows = Math.ceil(height / nodeSize); // Calcula el número de filas
  numCols = Math.ceil(width / nodeSize); // Calcula el número de columnas

  // Crea la matriz de objetos Node
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }

  // Selección del algoritmo
  textAlign(CENTER);
  sel = createSelect();
  sel.position(10, 10);
  sel.option("Breath-first-search");
  sel.option("Depth-first-search");
  sel.option("A*");
  sel.option("Dijkstra");
  sel.option("Genetic");
  sel.selected("Breath-first-search");

  // Ajuste del peso del grid
  grid_slider = createSlider(0, 2, 1, 0.05);
  grid_slider.attribute("disabled", "");
  grid_slider.position(10, 40);

  // Botón para iniciar la búsqueda
  search_button = createButton("Search");
  search_button.mousePressed(searching_end);
  search_button.attribute("disabled", "");
  search_button.position(10, 70);
  // Cantidad de noise 
  noise_slider = createSlider(0, (width * height) / nodeSize / nodeSize, 0, 1);
  noise_slider.position(10, 130);
  noise_slider.changed(noise_change);
}

function draw() {
  background(0); // Establece el color de fondo en negro
  strokeWeight(grid_slider.value()); // Establece el grosor del grid

  // Dibuja los nodos
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] != null) {
        grid[i][j].show();
      }
    }
  }

  for (let i = 0; i < genetic_pob.length; i++) {
    for (let j = 0; j < genetic_pob[i].length; j++) {
      genetic_pob[i][j].show();
    }
  }
  for (let i = 0; i < final_path.length - 1; i++) {
    connect_line(final_path[i], final_path[i + 1]);
  }
}

function mousePressed() {
  if (firstClick) {
    // Obtén el nodo sobre el que se hizo clic y asígnalo a la variable start
    const i = Math.floor(mouseY / nodeSize); // índice de fila
    const j = Math.floor(mouseX / nodeSize); // índice de columna
    start = grid[i][j]; // asigna el nodo seleccionado a la variable start
    if (start != null) {
      start.color = color(135, 206, 250); // cambia el color del nodo a azul claro
      start.visited = false; // marca el nodo como no visitado
    }
    firstClick = false;
    secondClick = true;
  } else if (secondClick) {
    // Obtén el nodo sobre el que se hizo clic y asígnalo a la variable end
    const i = Math.floor(mouseY / nodeSize); // índice de fila
    const j = Math.floor(mouseX / nodeSize); // índice de columna
    end = grid[i][j]; // asigna el nodo seleccionado a la variable end
    if (end != null) {
      end.visited = false; // marca el nodo como no visitado
      end.color = color(135, 206, 250); // cambia el color del nodo a azul claro
    }
    secondClick = false;
    search_button.removeAttribute("disabled"); // habilita el botón de búsqueda
    grid_slider.removeAttribute("disabled"); // habilita el control deslizante de la cuadrícula
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
          grid[i][j] = null; // elimina el nodo de la cuadrícula
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

function searching_end() {
  final_path = [];

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] != null && grid[i][j] != start && grid[i][j] != end) {
        grid[i][j].color = color(255, 255, 255);
        grid[i][j].visited = false;
      }
    }
  }
  print(sel.value());

  genetic_pob = [];
  genetic_fitness = [];
  genetic_dna = [];
  

  switch (sel.value()) {
    case "Breath-first-search":
      bfs(start, end);
      break;
    case "Dijkstra":
      dijkstra(start, end);
      break;
    case "Genetic":
      genetic(start, end, 10);
      break;
    case "Depth-first-search":
      depth(start, end);
      break;
    case "A*":
      astar(start, end);
      break;
    default:
      break;
  }
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
  firstClick = false;
  secondClick = false;
  grid = [];
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }
}


// La función noise_change cambia la cantidad de ruido en el mapa, agregando o eliminando nodos de forma aleatoria.
// Obtiene el valor del control deslizante de ruido, luego agrega o elimina nodos aleatorios en el mapa según ese valor.
// Si el valor es mayor que el valor anterior de ruido, agrega nodos aleatorios. De lo contrario, elimina nodos aleatorios y los reemplaza por nodos eliminados anteriormente.
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