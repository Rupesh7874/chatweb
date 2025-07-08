// const mongoose = require("mongoose");

// // Option schema: each answer has text + static point
// const onboardingOptionSchema = new mongoose.Schema({
//   text: String,
//   points: Number
// });

// // Question schema: one question, description, tag, and multiple options
// const onboardingQuestionSchema = new mongoose.Schema({
//   Title: String,
//   Description: String,
//   Tag: String,
//   Options: [onboardingOptionSchema] // <- Array of options for each question
// });

// module.exports = mongoose.model("OnboardingQuestion", onboardingQuestionSchema);
// exports.createQuestion = async (req, res) => {
//   try {
//     const { Title, Description, Tag, Options } = req.body;

//     const question = new OnboardingQuestion({ Title, Description, Tag, Options });
//     await question.save();

//     res.json({ success: true, data: question });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// //in postman json
// {
//   "Title": "How often do you eat out?",
//   "Description": "Understanding your food habits.",
//   "Tag": "eating-out",
//   "Options": [
//     { "text": "Very often", "points": 3 },
//     { "text": "Sometimes", "points": 2 },
//     { "text": "Rarely", "points": 1 },
//     { "text": "Never", "points": 0 }
//   ]
// }
