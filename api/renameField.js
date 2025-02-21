const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/jumbo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the schema (temporary)
const Question = mongoose.model(
  "Question",
  new mongoose.Schema({ text: String, options: [String], correctAnswer: String })
);

const renameField = async () => {
  try {
    await Question.updateMany({}, { $rename: { "text": "question" } });
    console.log("Field renamed successfully");
  } catch (error) {
    console.error("Error renaming field:", error);
  } finally {
    mongoose.connection.close();
  }
};

renameField();
