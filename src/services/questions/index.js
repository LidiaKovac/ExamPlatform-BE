const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid");
const { writeFile } = require("fs-extra");
const { join } = require("path");
const { readJSON, writeJSON } = require("fs-extra");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const readDataBase = async (path) => {
  try {
    const jsonFile = await readJSON(join(__dirname, path));
    return jsonFile;
  } catch (error) {
    throw new Error(error);
    console.log(error);
  }
};

router.post(
  "/start",
  [check("candidateName").exists().withMessage("Please provide a valid name")],
  async (req, res, next) => {
    //gets all the questions, picks 5 random ones, then generates and posts the new exam:
    //reads questions DB
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        console.log(err.message);
        err.httpStatusCode = 400;
        next(err);
      } else {
        const questions = await readDataBase("questions.json");
        //defines lenght of questions DB
        let questionNum = questions.length;
        let index = [0, 1, 2, 3, 4];
        let newNum;
        let numbers = [];
        index.forEach((num, index) => {
          //generated 5 random numbers
          newNum = Math.floor(Math.random() * questionNum) + 1;
          console.log(newNum);
          //checks if numbers are duplicated
          if (numbers[index] === numbers[index++]) {
            numbers.push(newNum);
          } else newNum = Math.floor(Math.random() * questionNum) + 1;
        });
        console.log(numbers);
        let chosenQuestions = [];
        //picks chosen questions
        numbers.forEach((num) => {
          chosenQuestions.push(questions[num]);
        });
        const newExam = {
          _id: uniqid(),
          candidateName: req.body.candidateName,
          examDate: new Date(),
          isCompleted: false,
          name: "Admission test",
          totalDuration: 30,
          questions: chosenQuestions,
          score: 0
        };
        if (newExam) {
          const exams = await readDataBase("../exams/exams.json");
          exams.push(newExam);
          await fs.writeFileSync(
            path.join(__dirname, "../exams/exams.json"),
            JSON.stringify(exams)
          );
          res.status(201).send(newExam._id);
        } else console.log("error");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }

    /*{
    "_id":"5fd0de8f2bf2321fe8743f1f", // server generated
    "candidateName": "Tobia",
    "examDate": "2021-01-07T10:00:00.000+00:00", // server generated
    "isCompleted":false, // false on creation
    "name":"Admission Test",
    "totalDuration": 30, // used only in extras
    "questions":[ // randomly picked from questions.json
        {
        !!!!!!!!"providedAnswer": 0, // added when the user provides an answer (not on creation)
        "duration":60,
        "text":"This is the text of the first question",
        "answers":[
            {
            "text":"Text for the first answer",
            "isCorrect":false
            },
            {
            "text":"Text for the second answer",
            "isCorrect":true
            },{
            "text":"Text for the third answer",
            "isCorrect":false
            },{
            "text":"Text for the fourth answer",
            "isCorrect":false
            }]
        },
        {
        // second randomly picked question
        },
        {
        // third randomly picked question
        }, 
        {
        // fourth randomly picked question
        },
        {
        // fifth randomly picked question
        },         
      ]
    } */
  }
);

router.post(
  "/:id/answer",
  [
    check("answer")
      .exists()
      .withMessage("An answer must be provided")
      .isInt()
      .withMessage("Answer must be a number"),
  ],
  async (req, res, next) => {
    try {
      const examDB = await readDataBase("../exams/exams.json");
      const exam = await examDB.filter((exam) => exam._id === req.params.id);
      let score = exam[0].score;
      console.log(score)
      let answersGiven = 0;
      let newScore = score
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
        //this needs to be awaited to ensure line 190
        quest.answers.forEach((an, index) => {
          if (an.isCorrect === true) {
            answerCheck.push(index);
          }
        });
        console.log(answerCheck);
      });
      
      //check if the answer provided is correct
      if (req.body.answer === answerCheck[req.body.question]) {
        newScore = score + 1 
      }
      console.log(req.body.answer, answerCheck[req.body.question] )
      if (req.body.question === 4) {
        exam[0].isCompleted = true;
      }

      const newExam = {
        ...exam[0],
        score: newScore
      };
      exam[0] = newExam
      await fs.writeFileSync(
          path.join(__dirname, '../exams/exams.json'),
          JSON.stringify(exam)
      )
      res.status(201).send({exam})
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
router.get("/:id", async(req,res,next) => {
    try {
        const examsDB = await readDataBase("../exams/exams.json")
        console.log(examsDB)
        const exam = await examsDB.filter((e)=>e._id === req.params.id)
       
        res.send(exam)
    } catch(error) {
        console.log(error)
        next(error)
    }
    
})

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
