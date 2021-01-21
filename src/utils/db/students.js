module.exports = (sequelize, DataTypes) => {
    const Students = sequelize.define(
      "student",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        candidate_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attempts: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
      },
      { timestamps: false }
    );
    Students.associate = (models) => {
      Students.hasOne(models.Exam);
    };
    return Students;
  };