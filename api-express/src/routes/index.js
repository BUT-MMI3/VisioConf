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
    console.log("une requete sur /");
    res.send("Hello World!");
});

module.exports = router;
