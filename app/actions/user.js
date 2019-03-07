const cloud = require("cloudinary");
const User = require("../models/user");
const Handler = require("./handlers");

async function add(req, res) {
  try {
    await User.create({ ...req.body });
    return Handler.successHandler(res, "Usuário criado com sucesso.");
  } catch (err) {
    return Handler.errorHandler(res, "Erro ao criar usuário.", 500);
  }
}

async function find(req, res) {
  try {
    const user = await User.findOne({ name: req.body.name }, { __v: 0 });
    if (!user) {
      throw "Usuário inexistente.";
    }
    return Handler.successHandler(res, user);
  } catch (err) {
    return Handler.errorHandler(res, err, 500);
  }
}

async function findAll(req, res) {
  try {
    const users = await User.find({}, { __v: 0 });
    return Handler.successHandler(res, users);
  } catch (err) {
    return Handler.errorHandler(res, "Error ao buscar todos os usuários.", 500);
  }
}

async function update(req, res) {
  try {
    const user = await User.update({ _id: req.body._id }, req.body);
    if (!user) return Handler.errorHandler(res, "Usuário inexistente", 400);
    return Handler.successHandler(res, "Usuário alterado com sucesso.");
  } catch (err) {
    return Handler.errorHandler(res, "Erro ao alterar usuário.", 500);
  }
}

async function addTwitter(req, res) {
  const { _id, content } = req.body;
  try {
    const user = await User.findOne({ _id });
    user.twitters.push({ content });
    const data = await User.findOneAndUpdate({ _id }, user, {
      new: true
    });
    return Handler.successHandler(res, data);
  } catch (err) {
    return Handler.errorHandler(res, "Error ao criar twitter.", 500);
  }
}

async function upload(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  let sampleFile = req.files.img;
  sampleFile.mv("./tmp/filename.jpg", async function(err) {
    if (err) return res.status(500).send(err);
    await cloud.uploader.upload("./tmp/filename.jpg", result =>
      console.log(result)
    );
    res.send("File uploaded!");
  });
}

module.exports = {
  add,
  update,
  find,
  findAll,
  addTwitter,
  upload
};
