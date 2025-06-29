const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  numberOfTopics: Number,
  publishedAt: Date,
});

module.exports = mongoose.model("Course", courseSchema);
