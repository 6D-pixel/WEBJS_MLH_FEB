// Import the FCL library
import { query, mutate, tx, reauthenticate, send } from "@onflow/fcl";
// Configure FCL
import * as fcl from '@onflow/fcl'
import * as t from "@onflow/types";
import "./config.js";

// Define the sender and receiver addresses
const sender = "0x254cc842174ec9d4"; // Replace with your testnet address
const receiver = "0x3f6d0a02d7aa2baa"; // Replace with the recipient's testnet address

// Define the amount of Flow tokens to transfer (in units of 10^-8 FLOW)

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

const botPrivateKey             ="1094650b2dfd99a25cc8cbe9d0561bd8b79112e35cd547217bd59aea54a1d077d1946d01fd9f3ce2c3291f2a2d7f78c50e5293a03ee163d718011d1f66cfb70a";
const userPrivateKey = "a8fcc5d605f6085986182002af436ac5e1b5312af4b2695fcc494119c628b69a";

// Function to send Flow tokens
async function sendTokens(botAddress, userAddress, amount) {
  try {
    // Authorize the transaction with the bot's private key
    await fcl
      .send([
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
        fcl.authorizations([fcl.keys.bot(botPrivateKey)]),
        fcl.limit(100),
      ])
      .then(fcl.decode);

    console.log(
      `Tokens sent successfully from ${botAddress} to ${userAddress}`
    );
  } catch (error) {
    console.error("Error sending tokens:", error);
  }
}

const botAddress = "0x254cc842174ec9d4";
const userAddress = "0x3f6d0a02d7aa2baa";
const amount = 10.0; // 10 Flow tokens

export { getFlowBalance, sendTokens };
