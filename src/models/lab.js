const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
    labId: String,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    nombre: String,
    cantidadPCs: Number
});

module.exports = mongoose.model("Lab", labSchema);