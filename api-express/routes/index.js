/**
 * Author: @mathis-lambert
 * Date : Janvier 2024
 */
const express = require("express");
const router = express.Router();
// Require controller modules.

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Routes of the application
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
router.get("/", async function (req, res) {
  res.render("home", {
    loggedIn: req.session.userId ? true : false,
    username: req.session.username,
  });
});

module.exports = router;
