import { authenticate, unauthenticate } from "@onflow/fcl/dist/fcl";
import './config'
export async function login() {
   authenticate();
}
export async function logout() {
   unauthenticate();
}
