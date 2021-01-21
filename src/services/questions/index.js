const express = require("express");
const { check } = require("express-validator");
const fs = require("fs");
const { QueryTypes } = require('sequelize'); //allows us to use raw queries
const path = require("path");
const { Student, Exam, Question } = require("../../utils/db"); //another synstax of line 9, more familiar
const db = require("../../utils/db")
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);


const router = express.Router();

router.post("/start", async (req, res, next) => {
  //gets all the questions, picks 5 random ones, then generates and posts the new exam:
  const response = await Question.findAll(); //reads questions DB
  const lines = response.length;
  let index = [0, 1, 2, 3, 4];
  let newNum;
  let numbers = [];
  index.forEach((num, index) => {
    //generates 5 random numbers
    newNum = Math.floor(Math.random() * lines);
    numbers.push(newNum);
  });
  let uniq = [...new Set(numbers)]; //Set() deletes all the duplicates
  while (uniq.length < 5) {
    newNum = Math.floor(Math.random() * lines);
    numbers.push(newNum);
    uniq = [...new Set(numbers)];
  }
  console.log(uniq);
  let question_set = [...uniq]; //chosen questions
  /*CREATE A NEW STUDENT: 
    SQLize syntax: const jane = await User.create({ firstName: "Jane", lastName: "Doe" });
    console.log("Jane's auto-generated ID:", jane.id); 
*/
  const newStudent = await Student.create({
    candidate_name: req.body.candidate_name,
    score: 0,
    attempts: 0,
  });
  //creates new Exam for newly created student
  console.log("CREATED: ", newStudent.dataValues);
  const newExam = await Exam.create({
    studentId: newStudent.dataValues.id,
  });
  //Inserts question set into QuestionSet table alongside with the corresponding exam id
  
    // question_set.forEach((q, i) => {
    //   try {
    //   //adds foreign key values
      
    // } catch(error) {
    //   console.log(error)
    // }
    // });
  
  /*retrieve the complete exam 
SQLize syntax: Post.findAll({
  where: {
    authorId: 2
  }
});
*/
    const exam_created = {
      candidate_name: newStudent.dataValues.candidate_name,
      questions: question_set,
      exam_id: newExam.dataValues.id
    }
 
    res.status(201).send(exam_created)


  /*
  //generate a question "set", a set of 5 different questions randomly picked.  
  });
  const query = `INSERT INTO exams (
      question_1, 
      question_2, 
      question_3, 
      question_4, 
      question_5) 
        VALUES (
          ${question_set[0]}, 
          ${question_set[1]}, 
          ${question_set[2]}, 
          ${question_set[3]}, 
          ${question_set[4]}); 
        INSERT INTO students (
          candidate_name, 
          score, 
          attempts) 
        VALUES(${req.body.candidateName}, 0, 0) `;
  res.status(201).send("Ok");*/
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
