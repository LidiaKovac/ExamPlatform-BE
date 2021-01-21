const { Sequelize, DataTypes } = require("sequelize");
const Student = require("./students");
const Exam = require("./exams");
const Question = require("./questions");

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
  }
);

const models = {
  Student: Student(sequelize, DataTypes),
  Exam: Exam(sequelize, DataTypes),
  Question: Question(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

sequelize
  .authenticate()
  .then(() => console.log("💡 DB CONNECTED!"))
  .catch((e) => console.log("❌ CONNECTION FAILED!"));

module.exports = models;
