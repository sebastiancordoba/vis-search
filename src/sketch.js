p5.disableFriendlyErrors = true;

let grid = [];
let nodeSize = 25;
let numRows, numCols;
let start = null;
let end = null;
let state = 'SELECT_START'; // SELECT_START, SELECT_END, READY, SEARCHING, FINISHED

let search_button, restart_button, algo_select, grid_weight_slider, noise_slider;
let final_path = [];
let noise_count = 0;
let noises = [];

// Genetic algorithm specific globals
let genetic_pob = [];
let genetic_dna = [];
let genetic_fitness = [];
let gen_button;

function setup() {
  const canvas = createCanvas(700, 600);
  canvas.parent("main");

  numRows = Math.floor(height / nodeSize);
  numCols = Math.floor(width / nodeSize);

  initializeGrid();
  setupUI();
}

function initializeGrid() {
  grid = [];
  for (let i = 0; i < numRows; i++) {
    grid[i] = [];
    for (let j = 0; j < numCols; j++) {
      grid[i][j] = new Node(j * nodeSize, i * nodeSize, nodeSize);
    }
  }
}

function setupUI() {
  const controls = select("#controls");

  // Title
  createElement('h1', 'VisSearch').parent(controls);

  // Algorithm Selector
  createControlGroup(controls, 'Algorithm', () => {
    algo_select = createSelect();
    algo_select.option("A*", "A*");
    algo_select.option("Dijkstra", "Dijkstra");
    algo_select.option("Breadth-first-search", "BFS");
    algo_select.option("Depth-first-search", "DFS");
    algo_select.option("Genetic", "Genetic");
    algo_select.selected("A*");
  });

  // Grid Weight Slider
  createControlGroup(controls, 'Grid Intensity', () => {
    grid_weight_slider = createSlider(0, 2, 0.5, 0.1);
  });

  // Noise Slider
  createControlGroup(controls, 'Obstacle Density', () => {
    noise_slider = createSlider(0, 100, 0, 1);
    noise_slider.input(handleNoiseChange);
  });

  // Search Button
  search_button = createButton("Start Search");
  search_button.parent(controls);
  search_button.addClass("primary");
  search_button.mousePressed(startSearch);
  search_button.attribute("disabled", "");

  // Restart Button
  restart_button = createButton("Reset Board");
  restart_button.parent(controls);
  restart_button.mousePressed(resetBoard);

  // Genetic Button (initially hidden)
  gen_button = createButton("Next Generation");
  gen_button.parent(controls);
  gen_button.mousePressed(() => { if (window.generate) window.generate(); });
  gen_button.hide();

  // Instructions
  const instr = createElement('div').parent(controls);
  instr.style('margin-top', '10px');
  instr.html(`
    <div class="control-label" style="margin-bottom: 5px">Instructions</div>
    <p id="instruction-text" style="font-size: 0.8rem; line-height: 1.4; color: #8b949e; margin: 0">
      Click to set <b>Start</b> node.
    </p>
  `);
}

function createControlGroup(parent, labelText, createContent) {
  const group = createElement('div').addClass('control-group').parent(parent);
  createElement('label', labelText).addClass('control-label').parent(group);
  createContent().parent(group);
}

function updateInstructions() {
  const txt = select("#instruction-text");
  if (!txt) return;

  switch (state) {
    case 'SELECT_START': txt.html("Click on the grid to set the <b>Start</b> position."); break;
    case 'SELECT_END': txt.html("Now click to set the <b>Target</b> position."); break;
    case 'READY': txt.html("<b>Ready!</b> Add walls by dragging, or click 'Start Search'."); break;
    case 'SEARCHING': txt.html("Finding path..."); break;
    case 'FINISHED': txt.html("Search complete. Press 'Reset' to clear."); break;
  }
}

function draw() {
  background(13, 17, 23);
  strokeWeight(grid_weight_slider.value());

  // Show grid
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j]) grid[i][j].show();
    }
  }

  // Show genetic population if any
  for (let i = 0; i < genetic_pob.length; i++) {
    for (let j = 0; j < genetic_pob[i].length; j++) {
      genetic_pob[i][j].show();
    }
  }

  // Draw final path
  if (final_path && final_path.length > 0) {
    stroke(88, 166, 255);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let node of final_path) {
      vertex(node.x + nodeSize / 2, node.y + nodeSize / 2);
    }
    endShape();
  }
}

function mousePressed() {
  // Ignore clicks outside canvas or on UI
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;

  const j = Math.floor(mouseX / nodeSize);
  const i = Math.floor(mouseY / nodeSize);

  if (i < 0 || i >= numRows || j < 0 || j >= numCols) return;

  const target = grid[i][j];
  if (!target) return;

  if (state === 'SELECT_START') {
    start = target;
    start.color = color(88, 166, 255); // Blue
    state = 'SELECT_END';
  } else if (state === 'SELECT_END') {
    if (target === start) return;
    end = target;
    end.color = color(248, 81, 73); // Red
    state = 'READY';
    search_button.removeAttribute("disabled");
  } else if (state === 'READY' || state === 'FINISHED') {
    if (target !== start && target !== end) {
      grid[i][j] = null;
    }
  }
  updateInstructions();
}

function mouseDragged() {
  if (state === 'READY' || state === 'FINISHED') {
    const j = Math.floor(mouseX / nodeSize);
    const i = Math.floor(mouseY / nodeSize);
    if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
      const target = grid[i][j];
      if (target && target !== start && target !== end) {
        grid[i][j] = null;
      }
    }
  }
}

function startSearch() {
  if (!start || !end) return;

  state = 'SEARCHING';
  updateInstructions();
  search_button.attribute("disabled", "");

  // Clear previous search state but keep walls
  resetPaths();

  const algo = algo_select.value();
  console.log("Running: " + algo);

  switch (algo) {
    case "BFS": bfs(start, end); break;
    case "Dijkstra": dijkstra(start, end); break;
    case "Genetic":
      gen_button.show();
      genetic(start, end, 20);
      break;
    case "DFS": depth(start, end); break;
    case "A*": astar(start, end); break;
  }

  state = 'FINISHED';
  updateInstructions();
}

function resetPaths() {
  final_path = [];
  genetic_pob = [];
  genetic_fitness = [];
  genetic_dna = [];
  gen_button.hide();

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      let n = grid[i][j];
      if (n && n !== start && n !== end) {
        n.visited = false;
        n.color = color(48, 54, 61, 100);
        n.parent = null;
      }
    }
  }
}

function resetBoard() {
  start = null;
  end = null;
  state = 'SELECT_START';
  final_path = [];
  noises = [];
  noise_count = 0;
  noise_slider.value(0);
  initializeGrid();
  updateInstructions();
  search_button.attribute("disabled", "");
  gen_button.hide();
}

function handleNoiseChange() {
  let targetCount = noise_slider.value();
  // Simplified noise removal/addition
  if (targetCount > noise_count) {
    for (let k = 0; k < targetCount - noise_count; k++) {
      let r = floor(random(numRows));
      let c = floor(random(numCols));
      if (grid[r][c] && grid[r][c] !== start && grid[r][c] !== end) {
        noises.push({ r, c, node: grid[r][c] });
        grid[r][c] = null;
      }
    }
  } else {
    for (let k = 0; k < noise_count - targetCount; k++) {
      if (noises.length > 0) {
        let last = noises.pop();
        grid[last.r][last.c] = last.node;
      }
    }
  }
  noise_count = noise_slider.value();
}