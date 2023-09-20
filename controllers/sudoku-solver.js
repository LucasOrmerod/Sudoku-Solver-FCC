class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    };

    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    };

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    };

    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;

    for (let i = rowStart; i < rowEnd; i++) {
      if (puzzleString[i] === value) {
        return false;
      };
    };

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = column; i < 81; i += 9) {
      if (puzzleString[i] === value) {
        return false;
      };
    };

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const rowStart = Math.floor(row / 3) * 3;
    const colStart = Math.floor(column / 3) * 3;

    for (let i = rowStart; i < rowStart + 3; i++) {
      for (let j = colStart; j < colStart + 3; j++) {
        if (puzzleString[i * 9 + j] === value) {
          return false;
        };
      };
    };

    return true;
  }

  solve(puzzleString) {
    if (this.validate(puzzleString) !== true) {
      return { valid: false };
    };

    const solveSudoku = () => {
      for (let i = 0; i < 81; i++) {
        if (puzzleString[i] === ".") {
          const row = Math.floor(i / 9);
          const col = i % 9;
          for (let num = 1; num <= 9; num++) {
            const numStr = num.toString();
            if (
              this.checkRowPlacement(puzzleString, row, col, numStr) &&
              this.checkColPlacement(puzzleString, row, col, numStr, i) &&
              this.checkRegionPlacement(puzzleString, row, col, numStr, i)
            ) {
              puzzleString = puzzleString.substring(0, i) + numStr + puzzleString.substring(i + 1);
              if (solveSudoku()) {
                return true;
              };
              puzzleString = puzzleString.substring(0, i) + "." + puzzleString.substring(i + 1);
            };
          };
          return false;
        }
      }
      return true;
    };

    if (solveSudoku()) {
      return { solution: puzzleString };
    } else {
      return { error: "Puzzle cannot be solved" };
    };
  }

  checkValue(puzzleString, coordinate, value) {
    if (!puzzleString || !coordinate || !value) {
      return { error: "Required field(s) missing" };
    };

    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    };

    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    };

    const rowMapping = {
      A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8
    };


    if (!/^[A-I]$/.test(coordinate[0].toUpperCase())) {
      return { error: "Invalid coordinate" };
    };

    if (coordinate.length > 2 || coordinate[1] < 1 || coordinate[1] > 9 || !/^[1-9]$/.test(coordinate[1])) {
      return { error: "Invalid coordinate" };
    };

    const row = rowMapping[coordinate[0].toUpperCase()];
    const col = parseInt(coordinate[1]) - 1;

    if (value < 1 || value > 9) {
      return { error: "Invalid value" };
    };

    const cellIndex = row * 9 + col;

    // return true if the number is already on the cell
    if (puzzleString[cellIndex] === value) {
      return { valid: true };
    };

    if (!/^[1-9]$/.test(value)) {
      return { error: "Invalid value" };
    };

    let conflictsArray = [];
    if (!this.checkRowPlacement(puzzleString, row, col, value)) {
      conflictsArray.push("row");
    };

    if (!this.checkColPlacement(puzzleString, row, col, value)) {
      conflictsArray.push("column");
    };

    if (!this.checkRegionPlacement(puzzleString, row, col, value)) {
      conflictsArray.push("region");
    };

    if (conflictsArray.length > 0) {
      return { valid: false, conflict: conflictsArray };
    } else {
      return { valid: true };
    };
  }
}


module.exports = SudokuSolver;