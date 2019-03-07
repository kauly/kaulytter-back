const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Handler = require("./handlers");

async function sign(req, res) {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ name });
    if (!user || !user.isValidPassword(password)) {
      throw "Usuário ou senha inválidos.";
    }
    const token = jwt.sign({ name }, process.env.SECRET);
    return Handler.successHandler(res, { user, token });
  } catch (err) {
    return Handler.errorHandler(res, err, 500);
  }
}

async function signup(req, res, next) {
  const { name } = req.body;
  try {
    const user = await User.findOne({ name });
    if (user)
      return Handler.errorHandler(
        res,
        "Já existe um usuário cadastrado com esse nome.",
        400
      );
    const newUser = await User.create({ ...req.body });
    const token = jwt.sign({ name }, process.env.SECRET);
    return Handler.successHandler(res, { token, user: newUser });
  } catch (err) {
    return Handler.errorHandler(res, "Erro ao criar usuário.", 500);
  }
}

module.exports = {
  sign,
  signup
};
