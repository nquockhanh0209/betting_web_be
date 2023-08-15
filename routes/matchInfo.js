const express = require("express");
const Bet = require("../models/bet");
const router = express.Router();
const fs = require("fs");
var path = require("path");
const {
  createMatchContract,
} = require("../contract_handle/createMatchContract.js");

var Minio = require("minio");

var minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
});

//get one

router.get("/getAll", async (req, res) => {
  const allMatch = await Bet.find({}).exec();
  res.data = Array.from(allMatch);
  console.log(Array.isArray(allMatch));
  res.send(res.data);
});
router.get("/getNow", getBetInfoFromNow, async (req, res) => {
  res.data = Array.from(res.betInfo);
  console.log(Array.isArray(res.betInfo));
  res.send(res.data);
});
router.get("/getPast", getBetInfoFromPast, async (req, res) => {
  res.data = Array.from(res.betInfo);
  console.log(Array.isArray(res.betInfo));
  res.send(res.data);
});
// router.get("/:id", getBetInfo, (req, res) => {
//   res.send(res.betInfo);
// });
// router.put("/:id", async (req, res) => {
//   await createMatchContract(req.params.id);
// });
//create one
async function updateMatchContract(id) {
  const new_address = await createMatchContract(id);
  console.log("new_address is", new_address);
}
function uploadToMinIO(filename) {
  var metaData = {
    "Content-Type": "application/octet-stream",
  };
  minioClient.fPutObject(
    "team-image-betting-website",
    filename,
    "/home/khanh/betting_web/betting_team_image/images/" + filename,
    metaData,
    function (err, etag) {
      if (err) return console.log(err);
      console.log("File uploaded successfully.");
    }
  );
}
router.post("/", async (req, res) => {
  try {
    uploadToMinIO(req.body.team1Img);
    uploadToMinIO(req.body.team2Img);
    const betInfo = new Bet({
      matchFormat: req.body.matchFormat,

      matchName: req.body.matchName,
      matchStartDate: req.body.matchStartDate,
      team1Name: req.body.team1Name,
      team1Img:
        "http://127.0.0.1:9000/team-image-betting-website/" + req.body.team1Img,
      team2Name: req.body.team2Name,
      team2Img:
        "http://127.0.0.1:9000/team-image-betting-website/" + req.body.team2Img,
      matchBetWinProportion: req.body.matchBetWinProportion,
      matchBetDrawProportion: req.body.matchBetDrawProportion,
      matchBetLoseProportion: req.body.matchBetLoseProportion,
      matchStatus: req.body.matchStatus,
    });
    console.log(betInfo);

    console.log("saving to db...");

    // var newBetInfo = await betInfo.save().then(async (newBetInfo) =>{
    //   await updateMatchContract(betInfo).then(res.status(201).json(newBetInfo))
    // })
    var newBetInfo = await betInfo.save();
    await updateMatchContract(newBetInfo).then(
      res.status(201).json(newBetInfo)
    );
    // await Promise.all(betInfo.save(), updateMatchContract(betInfo)).then(
    //   res.status(201).json(newBetInfo)
    // );
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getBetInfoFromNow(req, res, next) {
  let betInfo;

  // let betDate = new Date(parseInt(req.params.dateUnix));
  // console.log(betDate);
  try {
    //console.log(betDate.toJSON());
    betInfo = await Bet.find({
      matchStartDate: { $gte: Date.now() },
      matchResult: { $exists: false },
    }).exec();
    if (betInfo == null) {
      return res.status(404).json({ message: "Cannot find" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err.message });
  }

  res.betInfo = betInfo;
  next();
}
async function getBetInfoFromPast(req, res, next) {
  let betInfo;

  // let betDate = new Date(parseInt(req.params.dateUnix));
  // console.log(betDate);
  try {
    //console.log(betDate.toJSON());
    betInfo = await Bet.find({ matchResult: { $exists: true } }).exec();
    if (betInfo == null) {
      return res.status(404).json({ message: "Cannot find" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: err.message });
  }

  res.betInfo = betInfo;
  next();
}
module.exports = router;
