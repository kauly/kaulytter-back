const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const twitterSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  content: { type: String, require: true },
  twitterImg: { type: String }
});

const userSchema = mongoose.Schema({
  name: { type: String, require: true, unique: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  password: { type: String, require: true },
  profileImg: { type: String },
  coverImg: { type: String },
  site: { type: String },
  bio: { type: String },
  county: { type: String },
  city: { type: String },
  state: { type: String },
  joinDate: { type: Date, default: Date.now },
  newUser: { type: Boolean, default: true },
  twitters: [twitterSchema]
});

userSchema.pre("save", async function() {
  const user = this;
  user.isNew && (user.password = await bcrypt.hash(user.password, 10));
  user.isNew && (user.newUser = true);
});

userSchema.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  console.log(compare);
  return compare;
};

module.exports = mongoose.model("User", userSchema);
