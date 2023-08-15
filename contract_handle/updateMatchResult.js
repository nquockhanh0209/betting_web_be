require("dotenv").config();
const ethers = require("ethers");
const { connectSMC } = require("./connectContract.js");
const Bet = require("../models/bet");
const { Client_abi  } = require("../contracts/smc.js");
const provider = new ethers.getDefaultProvider(process.env.GOERLI_URL);

async function updateMatchResult(matchInfo, api, res) {
  
  try {
   
    const options = {
      CONTRACT_ABI_SM: Client_abi,
      CONTRACT_ADDRESS_SM: process.env.CLIENT_ADDRESS,
      signer: new ethers.Wallet(process.env.DEV_PRIVATE_KEY, provider),
    };

    const contract = await connectSMC(options);
    console.log("call smc client success");

    const txn = await contract.requestMatchResult(
      process.env.ORACLE_ADDRESS,
      process.env.JOB_ID,
      api
    );
    // const rc = await txn.wait(); // 0ms, as tx is already confirmed
    // const event = rc.events.find(event => event.event === 'CreateClone');
    // const new_address = event.args;

    if (txn) {
      await contract.on("RequestMatchResultFulfilled", async () => {
        
        await res.status(201).json(matchInfo);
          

      })

      // await Bet.findByIdAndUpdate(id, { matchContract: new_address });
    }


  } catch (error) {
    console.log(error);
  }
}

module.exports = { updateMatchResult };
