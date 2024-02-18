import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  "discovery.authn.endpoint":
    "https://fcl-discovery.onflow.org/api/testnet/authn",
  "flow.network": "testnet",
  "0xFLOW": "0x7e60df042a9c0868",
  "0xFT": "0x9a0766d93b6608b7",
});
