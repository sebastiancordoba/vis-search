function genetic(startNode, endNode, pobSize){
    dna = '100100'
    const x = startNode.y / nodeSize;
    const y = startNode.x / nodeSize;
    show_genetic(dna, x, y);
}

function show_genetic(dna, x, y){
    let newX = x;
    let newY = y;
    for (let i = 0; i < dna.length; i+=3) {
        let move = dna.substring(i, i+3);
        let moves = switch_dna_move(move, newX, newY);
        newX = moves[0];
        newY = moves[1];
    }
}

function switch_dna_move(move_string, i ,j){
    let newI = i;
    let newJ = j;
    switch(move_string){
        case '000':

          break;
        case '001':

          break;
        case '010':

          break;
        case '011':

          break;
        case '100':
            grid[i][j + 1].color = color(255, 0, 0);
            newJ = j + 1;
          break;
        case '101':
          break;
        case '110':
          break;
        case '111':
          break;
        default:
          break;
      }
    return [newI, newJ];
}