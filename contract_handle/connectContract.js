const ethers = require("ethers");
const connectSMC = async ({ CONTRACT_ABI_SM, CONTRACT_ADDRESS_SM, signer }) => {
    try {
      return new ethers.Contract(CONTRACT_ADDRESS_SM, CONTRACT_ABI_SM, signer);
    } catch (error) {
      throw new Error(error.message);
    }
  };
module.exports= {connectSMC}