const cloud = require("cloudinary");
const User = require("../models/user");
const Handler = require("./handlers");
const _ = require("lodash");
const Server = require("../app");
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
    console.log(err);
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
const getLink = files => {
  let links = {};
  let count = 0;
  const len = _.size(files);

  return new Promise((resolve, reject) => {
    _.forIn(files, async (v, k) => {
      try {
        const link = await cloud.uploader.upload(v.tempFilePath);
        links = { ...links, [k]: link.secure_url };
        count++;
      } catch (err) {
        reject(err);
      }

      if (count === len) {
        resolve(links);
      }
    });
  });
};

async function update(req, res) {
  let links = {};
  try {
    if (req.files) {
      links = await getLink(req.files);
    }
    const omited = _.omit(req.body, ["coverImg", "profileImg"]);
    const newUser = { ...omited, ...links, newUser: false };
    await User.updateOne({ name: newUser.name }, newUser);
    Server.io.emit("reloadUser");
    return Handler.successHandler(res, links);
  } catch (err) {
    console.log(err);
    return Handler.errorHandler(res, "Erro ao alterar usuário.", 500);
  }
}

async function addTwitter(req, res) {
  const { name, content } = req.body;
  try {
    const user = await User.findOne({ name });
    user.twitters.push({ content });
    const data = await User.findOneAndUpdate({ name }, user, {
      new: true
    });
    Server.io.emit("reloadUser");
    return Handler.successHandler(res, data);
  } catch (err) {
    console.log(err);
    return Handler.errorHandler(res, "Error ao criar twitter.", 500);
  }
}

async function upload(req, res) {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send("No files were uploaded.");
  }
  console.log(req.files.img);
  await cloud.uploader.upload(req.files.img.tempFilePath, result =>
    res.send(result)
  );
}

module.exports = {
  add,
  update,
  find,
  findAll,
  addTwitter,
  upload
};
