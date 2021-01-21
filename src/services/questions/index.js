const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");
const db = require("../../utils/db"); //gets the database

const router = express.Router();
/* 

const query = `INSERT INTO authors(name,last_name) VALUES('${req.body.name}','${req.body.last_name}');`
    try { 
        const response = await db.query(query)
        res.status(201).send({rowCount: response.rowCount}) //this has to be JSON 
    } catch(error) {
        next(error)
    }

*/
router.post("/start", async (req, res, next) => {
  //gets all the questions, picks 5 random ones, then generates and posts the new exam:
  //reads questions DB
  await db.query(`SELECT * FROM questions`, function (err, result, fields) {
    if (err) throw err;
    console.log(result.rows);
    let questions = result.rows;
    let questionNum = result.rowCount;
    console.log("index: ", questionNum);
    let index = [0, 1, 2, 3, 4];
    let newNum;
    let numbers = [];
    index.forEach((num, index) => {
      //generates 5 random numbers
      newNum = Math.floor(Math.random() * questionNum);
      numbers.push(newNum);
    });
    let uniq = [...new Set(numbers)];
    console.log(uniq);
    while (uniq.length < 5) {
      newNum = Math.floor(Math.random() * questionNum);
      numbers.push(newNum);
      uniq = [...new Set(numbers)];
      console.log(uniq);
    }
    console.log(uniq);
    let chosenQuestions = [...uniq];
    //picks chosen questions
  });
  const query = `INSERT INTO exams (
      question_1, 
      question_2, 
      question_3, 
      question_4, 
      question_5) 
        VALUES (
          ${chosenQuestions[0]}, 
          ${chosenQuestions[1]}, 
          ${chosenQuestions[2]}, 
          ${chosenQuestions[3]}, 
          ${chosenQuestions[4]}); 
        INSERT INTO students (
          candidate_name, 
          score, 
          attempts) 
        VALUES(${req.body.candidateName}, 0, 0) `;
  res.status(201).send("Ok");
});

router.post(
  "/:id/answer",
  [
    check("answer")
      .exists()
      .withMessage("An answer must be provided")
      .isInt()
      .withMessage("Answer must be a number"),
    check("question")
      .exists()
      .withMessage("A question must be provided")
      .isInt()
      .withMessage("Answer must be a number"),
  ],
  async (req, res, next) => {
    try {
      const examDB = await readDataBase("../exams/exams.json");
      const exam = await examDB.filter((exam) => exam._id === req.params.id);
      let score = exam[0].score;
      let answersGiven = 0;
      let newScore = score;
      const newAnswer = {
        question: req.body.question,
        //the index will be passed in the fronend as a parameter in a
        //function that will be assigned to the "Submit answer button"
        answer: req.body.answer,
      };
      //same for the answer
      //check which answer is right and then post the provided answer and calculate the score

      let answerCheck = [];
      await exam[0].questions.forEach((quest) => {
        quest.answers.forEach((an, index) => {
          if (an.isCorrect === true) {
            answerCheck.push(index);
          }
        });
      });

      //check if the answer provided is correct
      if (req.body.answer === answerCheck[req.body.question]) {
        newScore = score + 1;
      }
      console.log("received ", req.body);
      if (req.body.question === 4) {
        exam[0].isCompleted = true;
      }

      const newExam = {
        ...exam[0],
        score: newScore,
      };
      exam[0] = newExam;
      await fs.writeFileSync(
        path.join(__dirname, "../exams/exams.json"),
        JSON.stringify(exam)
      );
      res.status(201).send(exam);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
router.get("/:id", async (req, res, next) => {
  try {
    //const examsDB = await readDataBase("../exams/exams.json");
    console.log(examsDB);
    const exam = await examsDB.filter((e) => e._id === req.params.id);

    res.send(exam);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/* answers: [
    {
        question: 0, // index of the question
        answer: 1, // index of the answer
    }...
]
*/

module.exports = router;

//server.get(/start)
//server.post(/answer)
