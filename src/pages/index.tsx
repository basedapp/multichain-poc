import { MagicProvider, useMagic } from "../providers/MagicProvider";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/components/magic/Login";
import Dashboard from "@/components/magic/Dashboard";
import { Network } from "@/utils/network";
import { useAtom } from "jotai";
import { magicInfoAtom } from "@/state/magic-atoms";

const supportedNetworks = [Network.POLYGON, Network.ARBITRUM, Network.SOLANA];

export default function Home() {
  const { isLoggedIn } = useMagic();


  return (
    <MagicProvider supportedNetworks={supportedNetworks}>
      <ToastContainer />
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <Login />
      )}
    </MagicProvider>
  );
}
