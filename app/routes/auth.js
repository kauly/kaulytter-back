const express = require("express");
const action = require("../actions/auth");

const router = express.Router();

router.post("/sign", action.sign);
router.post("/signup", action.signup);

module.exports = router;
