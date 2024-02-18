// Import the FCL library
import { query, mutate, tx, reauthenticate, send } from "@onflow/fcl";
// Configure FCL
import * as t from "@onflow/types"
import "./config.js"

// Define the sender and receiver addresses
const sender = "0x254cc842174ec9d4"; // Replace with your testnet address
const receiver = "0x3f6d0a02d7aa2baa"; // Replace with the recipient's testnet address

// Define the amount of Flow tokens to transfer (in units of 10^-8 FLOW)
const amount = 100000000; // 1 FLOW

//Balance function
const getFlowBalance = async (address) => {
    const cadence = `
      import FlowToken from 0xFLOW
      import FungibleToken from 0xFT
  
      pub fun main(address: Address): UFix64 {
        let account = getAccount(address)
  
        let vaultRef = account.getCapability(/public/flowTokenBalance)
          .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
          ?? panic("Could not borrow Balance reference to the Vault")
  
        return vaultRef.balance
      }
    `;
    const args = (arg, t) => [arg(address, t.Address)];
    const balance = await query({ cadence, args });
    console.log({ balance });
    return balance;
  };

const sendFlow = async (recepient, amount) => {
    const cadence = `
      import FungibleToken from 0xFT
      import FlowToken from 0xFLOW
  
      transaction(recepient: Address, amount: UFix64){
        prepare(signer: AuthAccount){
          let sender = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow Provider reference to the Vault")
  
          let receiverAccount = getAccount(recepient)
  
          let receiver = receiverAccount.getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Could not borrow Receiver reference to the Vault")
  
                  let tempVault <- sender.withdraw(amount: amount)
          receiver.deposit(from: <- tempVault)
        }
      }
    `;
    const args = (arg, t) => [arg(recepient, t.Address), arg(amount, t.UFix64)];
    const limit = 500;
  
    const txId = await mutate({ cadence, args, limit });
  
      console.log("Waiting for transaction to be sealed...");
  
      const txDetails = await tx(txId).onceSealed();
    console.log({ txDetails });
  };

//   (async () => {
//     console.clear();
//       // "reauthenticate" will ensure your session works properly
//     // and present you a popup to sign in
//     await reauthenticate();
  
//     // This is an example account we've created to this exibition
//     // You can replace it with one of your addresses
  
//     // Check "initial" balance first
//     await getFlowBalance(sender);
  
//     // Send some FLOW tokens to Recepient
//     await sendFlow(sender, "1.337");
  
//     // Ensure that Recepient's balance has been changed
//     await getFlowBalance(sender);
//   })();

export {getFlowBalance,sendFlow};