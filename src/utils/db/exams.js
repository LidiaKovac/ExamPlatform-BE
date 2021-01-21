module.exports = (sequelize, DataTypes) => {
  const Exams = sequelize.define(
    "exam",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
  question_set_id: {
        type: DataTypes.STRING
      }
    },
    { timestamps: false }
  );
  Exams.associate = (models) => {
    Exams.belongsTo(models.Student);
    Exams.belongsToMany(models.Question, {through: "QuestionSets" });
  };
  return Exams;
};
