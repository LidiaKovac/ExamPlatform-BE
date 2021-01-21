module.exports = (sequelize, DataTypes) => {
    const Students = sequelize.define(
      "student",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
      },
      { timestamps: false }
    );
    Students.associate = (models) => {
      Students.hasOne(models.Exam);
    };
    return Students;
  };