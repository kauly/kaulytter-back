const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Handler = require("./handlers");

async function sign(req, res) {
  const { name, password } = req.body;
  let validate = false;
  try {
    const user = await User.findOne({ name });
    user && (validate = await user.isValidPassword(password));
    if (!user || !validate) {
      return Handler.errorHandler(res, "Usuário ou senha inválidos.", 400);
    }
    const token = jwt.sign({ name }, process.env.SECRET);
    return Handler.successHandler(res, { userName: user.name, token });
  } catch (err) {
    console.log(err);
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
    return Handler.successHandler(res, { token, userName: newUser.name });
  } catch (err) {
    return Handler.errorHandler(res, "Erro ao criar usuário.", 500);
  }
}

function verifyToken(req, res, next) {
  let token = "";
  try {
    token = req.headers.authorization.split(" ")[1];
  } catch (err) {
    return res
      .status(403)
      .send({ auth: false, message: "Nem um token encontrado." });
  }
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .send({ auth: false, message: "O Token expirou." });
      } else if (err.name === "JsonWebTokenError") {
        return res
          .status(403)
          .send({ auth: false, message: "Token inválido." });
      }
    }
    next();
  });
}

module.exports = {
  sign,
  signup,
  verifyToken
};
