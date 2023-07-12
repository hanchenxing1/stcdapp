import Web3 from "web3";
import MyContractABI from './EcoCity.json';

//initializes the smart contract by connecting to a local blockchain node using the Web3 library
const initMyContract = async () => {
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
  const myContract = new web3.eth.Contract(MyContractABI.abi, "0xabfbBAb52eDE852F91d204ebDFE36E4C7b5441a6");
  return myContract;
};

export default initMyContract;
