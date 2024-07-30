import { MagicProvider } from "../providers/MagicProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Network } from "@/utils/network";
import Home from "./home";

const supportedNetworks = [Network.POLYGON, Network.ARBITRUM, Network.SOLANA];

export default function Index() {

  return (
    <MagicProvider supportedNetworks={supportedNetworks}>
      <ToastContainer />
      <Home />
    </MagicProvider>
  );
}
