module.exports = (sequelize, DataTypes) => {
  const Questions = sequelize.define(
    "question",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.STRING,
      },
      answer_w1: {
        type: DataTypes.STRING,
      },
      answer_w2: {
        type: DataTypes.STRING,
      },
      answer_w3: {
        type: DataTypes.STRING,
      },
      answer_r: {
        type: DataTypes.STRING,
      },
    },
    { timestamps: false }
  );
  Questions.associate = (models) => { //JS method that declares model relations 
    Questions.belongsToMany(models.Exam, {through: "QuestionSets" }); 
  };
  return Questions;
};
