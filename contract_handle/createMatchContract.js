require("dotenv").config();
const ethers = require("ethers");
const { connectSMC } = require("./connectContract.js");
const Bet = require("../models/bet");
const { CF_contract, Betting_contract } = require("../contracts/smc.js");
const provider = new ethers.getDefaultProvider(process.env.GOERLI_URL);
async function initializeContract(address, betInfo){
  const options = {
    CONTRACT_ABI_SM: Betting_contract,
    CONTRACT_ADDRESS_SM: address,
    signer: new ethers.Wallet(process.env.DEV_PRIVATE_KEY, provider),
  };
  const bet_win =  ethers.parseEther(betInfo.matchBetWinProportion.toString())
  const bet_draw =  ethers.parseEther(betInfo.matchBetDrawProportion.toString())
  const bet_lose=  ethers.parseEther(betInfo.matchBetLoseProportion.toString())
  const contract = await connectSMC(options);
  const txn = await contract.setMatchID(
    betInfo.matchName,
    bet_win,
    bet_draw,
    bet_lose,
    process.env.PAYMENTTOKEN_ADDRESS,
    process.env.CLIENT_ADDRESS,
    process.env.DEV_WALLET
  );
  if(txn){
    return true;
  }
}
async function createMatchContract(betInfo) {
  var new_address;
  try {
   
    const options = {
      CONTRACT_ABI_SM: CF_contract,
      CONTRACT_ADDRESS_SM: process.env.CLONEFACTORY_ADDRESS,
      signer: new ethers.Wallet(process.env.DEV_PRIVATE_KEY, provider),
    };

    const contract = await connectSMC(options);
    console.log("call smc clone factory success");

    const txn = await contract.createClone(
      process.env.BETTINGSTORAGE_CONTRACT_ADDRESS
    );
    // const rc = await txn.wait(); // 0ms, as tx is already confirmed
    // const event = rc.events.find(event => event.event === 'CreateClone');
    // const new_address = event.args;

    if (txn) {
      await contract.on("CreateClone", async (result) => {
        
        
          new_address = result;
          await Bet.findByIdAndUpdate(betInfo._id, { matchContract: result });
          await initializeContract(result, betInfo);
          console.log(new_address);

      })

      // await Bet.findByIdAndUpdate(id, { matchContract: new_address });
    }
    console.log(new_address);
    return new_address;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { createMatchContract };
