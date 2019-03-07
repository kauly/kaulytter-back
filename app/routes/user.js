const express = require("express");
const action = require("../actions/user");

const router = express.Router();

router.post("/add", action.add);
router.post("/find", action.find);
router.post("/update", action.update);
router.get("/findall", action.findAll);
router.post("/addtwitter", action.addTwitter);

module.exports = router;
