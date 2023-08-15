const express = require("express");
const Bet = require("../models/bet");
const router = express.Router();
const {updateMatchResult} = require("../contract_handle/updateMatchResult");
//get one
router.get("/", (req, res) => {
  res.send("HELLO");
});
router.get("/:id", getBetInfoById, (req, res) => {
  res.send(res.matchId);
});
//create one
router.put("/:id", async (req, res) => {
  try {
    const updateMatchInfo = await Bet.findByIdAndUpdate(req.params.id, {
      matchResult: req.body.matchResult,
      matchEndDate: req.body.matchEndDate,
      matchStatus: req.body.matchStatus,
    });
    const matchInfo = await Bet.findById(req.params.id);
    const route = "http://172.17.0.1:3000/match-result/"
    var api = route.concat(req.params.id);
    await updateMatchResult(matchInfo, api, res);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
async function getBetInfoById(req, res, next) {
  let matchId;
  try {
    matchId = await Bet.findById(req.params.id).exec();
    console.log(typeof matchId.id);
    if (matchId == null) {
      return res.status(404).json({ message: "Cannot find" });
    }
  } catch (error) {
    return res.status(500).json({ message: err.message });
  }

  res.matchId = matchId;

  next();
}

module.exports = router;
