// Import the FCL library
import { query, mutate, tx, reauthenticate, send } from "@onflow/fcl";
import { ec as EC } from "elliptic";

// Configure FCL
import * as fcl from '@onflow/fcl'
import * as t from "@onflow/types";
import "./config.js";

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


// Initialize the elliptic curve
const ec = new EC("p256");
const botPrivateKey=process.env.NEXT_PUBLIC_PRIVATE_KEY; 
const botPublicKey = ec.keyFromPrivate(botPrivateKey).getPublic().encode("hex");
async function sendFlow() {
  // Sign the transaction
  const authorization = fcl.currentUser().authorization;
  const response = await fcl.send([
    fcl.transaction`
      import FlowToken from 0xFLOW
      import FungibleToken from 0xFT

      transaction(amount: UFix64, to: Address) {
        let senderVault: @FungibleToken.Vault
        let receiverVault: &FlowToken.Vault{FungibleToken.Receiver}

        prepare(signer: AuthAccount) {
          self.senderVault <- signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Failed to borrow reference to sender vault")

          self.receiverVault = getAccount(to)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&FlowToken.Vault{FungibleToken.Receiver}>()
            ?? panic("Failed to borrow reference to receiver vault")
        }

        execute {
          let tokens <- self.senderVault.withdraw(amount: amount)

          self.receiverVault.deposit(from: <-tokens)
        }
      }
    `,
    fcl.args([
      fcl.arg(amount,t.UFix64),
      fcl.arg(userAddress,t.Address),
    ]),
    fcl.proposer(authorization),
    fcl.authorizations([authorization]),
    fcl.payer(authorization),
    fcl.limit(9999),
  ]);

  // Wait for the transaction to be sealed
  const transaction = await fcl.tx(response).onceSealed();

  console.log(transaction);
}

const botAddress = "0x254cc842174ec9d4";
const userAddress = "0x3f6d0a02d7aa2baa";
const amount = 10.0; // 10 Flow tokens

export { getFlowBalance, sendFlow };
