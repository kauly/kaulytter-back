const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Server is OK!");
});

router.use("/user", require("./user"));
router.use("/auth", require("./auth"));

router.get("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = router;
