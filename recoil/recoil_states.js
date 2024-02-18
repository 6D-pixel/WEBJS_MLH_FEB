import { atom, selector } from "recoil";

const userAddress = atom({
    key: "todoListState",
    default: ""
  });

  export {userAddress};