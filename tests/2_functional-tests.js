const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const PuzzlesAndSolutions = require("../controllers/puzzle-strings.js");
const puzzlesAndSolutions = PuzzlesAndSolutions.puzzlesAndSolutions;

const puzzleString = puzzlesAndSolutions[0][0];
const solved = puzzlesAndSolutions[0][1];

chai.use(chaiHttp);

suite('Functional Tests', () => {

  suite("POST to /api/solve", () => {

    test("Solve a puzzle with a valid puzzle", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleString })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "solution");
          assert.equal(res.body.solution, solved);
          done();
        });
    });

    test("Solve a puzzle with missing puzzle string", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Solve a puzzle with invalid characters", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: "!" + puzzleString.slice(1) })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Solve a puzzle with incorrect length", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleString + "." })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });

    test("Solve a puzzle that cannot be solved", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: "1" + puzzleString.slice(0, -1) })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });

  });

  suite("POST to /api/check", () => {

    test("Check a puzzle placement with all fields", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzleString,
          coordinate: "A2",
          value: 3
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with single placement conflict", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: solved,
          coordinate: "A2",
          value: 4
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with multiple placement conflicts", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: solved,
          coordinate: "A2",
          value: 1
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with all placement conflicts", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: solved,
          coordinate: "A2",
          value: 2
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "valid");
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Check a puzzle placement with missing required fields", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Required field(s) missing");
          done();
        });
    });

    test("Check a puzzle placement with invalid characters", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: "!" + puzzleString.slice(1),
          coordinate: "A2",
          value: 3
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Check a puzzle placement with incorrect length", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: "." + puzzleString,
          coordinate: "A2",
          value: 3
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement coordinate", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzleString,
          coordinate: "X12",
          value: 3
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Check a puzzle placement with invalid placement value", function(done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({
          puzzle: puzzleString,
          coordinate: "A2",
          value: 10
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, "error");
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });

    // https://forum.freecodecamp.org/t/personal-library-functional-tests-blocking-fcc-tests/583400/3
    after(function() {
      chai.request(server).get("/api");
    });

  });

});

