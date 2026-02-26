# VisSearch: Search Algorithm Visualizer

A premium, interactive visualization tool for exploring common search and pathfinding algorithms. Built with **p5.js** and designed with a modern GitHub-style dark theme.

Explore how different algorithms "see" the grid and find their way from start to finish.

## 🚀 Live Demo
[View Live Project](https://sebastiancordoba.github.io/vis-search/)

## ✨ Features

- **Multiple Algorithms**:
  - **A***: Heuristic-based optimal search (Manhattan distance).
  - **Dijkstra**: The classic shortest-path algorithm.
  - **BFS (Breadth-First Search)**: Guarantees shortest path in unweighted grids.
  - **DFS (Depth-First Search)**: Explores as far as possible before backtracking.
  - **Genetic Algorithm**: An evolutionary approach to pathfinding.
- **Interactive Grid**:
  - Click to set **Start** (Blue) and **Target** (Red).
  - Drag to create **Walls/Obstacles**.
  - Adjust **Obstacle Density** with the slider for procedural map generation.
- **Modern UI**:
  - Sleek dark mode with glassmorphism effects.
  - Real-time instruction updates.
  - Customizable grid line intensity.

## 📂 Project Structure

```text
vis-search/
├── src/                # Core application logic
│   ├── Node.js         # Grid node class
│   ├── sketch.js       # Main p5.js canvas & UI logic
│   ├── A_Star.js       # A* implementation
│   ├── BFS.js          # Breadth-First search
│   ├── DFS.js          # Depth-First search
│   ├── Dijkstra.js     # Dijkstra implementation
│   └── algos.js        # Genetic algorithm & utilities
├── lib/                # p5.js libraries
├── assets/             # Images and styles
├── index.html          # Entry point
└── style.css           # Premium dark mode styling
```

## 🛠️ Installation & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/sebastiancordoba/vis-search.git
   ```
2. Open `index.html` in any modern web browser.
3. No server or build step required!

## 📜 License
This project is licensed under the MIT License.
