const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const twitterSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  content: { type: String, require: true }
});

const userSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  profileImg: { type: String },
  coverImg: { type: String },
  nickName: { type: String },
  description: { type: String },
  country: { type: String },
  city: { type: String },
  joinDate: { type: Date, default: Date.now },
  twitters: [twitterSchema]
});

userSchema.pre("save", async function() {
  const user = this;
  user.isNew && (user.password = await bcrypt.hash(user.password, 10));
});

userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

module.exports = mongoose.model("User", userSchema);
