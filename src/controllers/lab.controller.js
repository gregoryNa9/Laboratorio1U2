const Lab = require("../models/lab");

exports.getAllLabs = async (req, res) => {
    const labs = await Lab.find().populate("courseId", "title");
    res.json(labs);
};

exports.createLab = async (req, res) => {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json({ message: "Laboratorio creado", lab });
};

exports.updateLab = async (req, res) => {
    await Lab.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Laboratorio actualizado" });
};

exports.deleteLab = async (req, res) => {
    await Lab.findByIdAndDelete(req.params.id);
    res.json({ message: "Laboratorio eliminado" });
};
