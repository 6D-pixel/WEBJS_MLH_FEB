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

// Function to send Flow tokens
async function sendTokens(botAddress, userAddress, amount) {
    try {
      // Authorize the transaction with the bot's private key
      await fcl.send([
        fcl.transaction`
          import FungibleToken from 0x9a0766d93b6608b7
          import FlowToken from 0x7e60df042a9c0868
  
          transaction {
            prepare(account: AuthAccount) {
              let sender = AuthAccount(payer: account)
              let recipient = AuthAccount(payer: account)
  
              // Replace with the actual token code and contract addresses
              let vault <- sender.load<@FungibleToken.Vault>(from: /storage/flowTokenVault)
              let receiverRef = recipient.getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()!
  
              // Transfer tokens from sender to recipient
              vault.withdraw(amount: UFix64(${amount}), recipient: receiverRef)
  
              // Log the transaction
              log(vault.withdraw(amount: UFix64(${amount}), recipient: receiverRef))
            }
          }
        `,
        fcl.payer(fcl.keys.bot(botPrivateKey)),
        fcl.proposer(fcl.keys.bot(botPrivateKey)),
        fcl.authorizations([fcl.keys.bobot(botPrivateKey)]),
        fcl.limit(100),
      ]).then(fcl.decode);
  
      console.log(`Tokens sent successfully from ${botAddress} to ${userAddress}`);
    } catch (error) {
      console.error("Error sending tokens:", error);
    }
  }

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