const express = require("express");
const router = express.Router();
const { verifyToken } = require("../actions/auth");

router.get("/", (req, res) => {
  res.send("Server is OK!");
});

router.use("/user", verifyToken, require("./user"));
router.use("/auth", require("./auth"));

router.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = router;
