const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const PuzzlesAndSolutions = require("../controllers/puzzle-strings.js");
const puzzlesAndSolutions = PuzzlesAndSolutions.puzzlesAndSolutions;

suite('Unit Tests', () => {
  test("Logic handles a valid puzzle string of 81 characters", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    let solved = puzzlesAndSolutions[0][1];
    assert.strictEqual(solver.solve(puzzleString).solution, solved);
  });

  test("Logic handles a valid puzzle string with invalid characters", function() {
    let puzzleString = "!" + puzzlesAndSolutions[0][0].slice(1);
    assert.strictEqual(solver.validate(puzzleString).error, "Invalid characters in puzzle");
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function() {
    let puzzleString = puzzlesAndSolutions[0][0] + ".";
    assert.strictEqual(solver.validate(puzzleString).error, "Expected puzzle to be 81 characters long");
  });

  test("Logic handles a valid row placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.strictEqual(solver.checkRowPlacement(puzzleString, 0, 1, 3), true);
  });

  test("Logic handles an invalid row placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.equal(solver.checkRowPlacement(puzzleString, 0, 1, 2), true);
  });

  test("Logic handles a valid column placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.strictEqual(solver.checkColPlacement(puzzleString, 0, 1, 3), true);
  });

  test("Logic handles an invalid column placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.strictEqual(solver.checkColPlacement(puzzleString, 0, 1, 4), true);
  });

  test("Logic handles a valid region placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.strictEqual(solver.checkRegionPlacement(puzzleString, 0, 1, 3), true);
  });

  test("Logic handles an invalid region placement", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    assert.strictEqual(solver.checkRegionPlacement(puzzleString, 0, 1, 8), true);
  });

  test("Valid puzzle strings pass the solver", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    let solved = puzzlesAndSolutions[0][1];
    assert.strictEqual(solver.solve(puzzleString).solution, solved);
  });

  test("Invalid puzzle strings fail the solver", function() {
    let puzzleString = "!" + puzzlesAndSolutions[0][0].slice(1);
    assert.strictEqual(solver.solve(puzzleString).valid, false);
  });

  test("Solver returns expected solution for an incomplete puzzle", function() {
    let puzzleString = puzzlesAndSolutions[0][0];
    let solved = puzzlesAndSolutions[0][1];
    assert.strictEqual(solver.solve(puzzleString).solution, solved);
  });
});
