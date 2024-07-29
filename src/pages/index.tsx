import { MagicProvider } from "../providers/MagicProvider";
import { tokenAtom } from "@/state/magic-atoms";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/components/magic/Login";
import Dashboard from "@/components/magic/Dashboard";
import { Network } from "@/utils/network";
import { useAtom } from "jotai";

const supportedNetworks = [Network.POLYGON, Network.ARBITRUM, Network.SOLANA];

export default function Home() {
  const [token,] = useAtom(tokenAtom);


  return (
    <MagicProvider supportedNetworks={supportedNetworks}>
      <ToastContainer />
      {token.length > 0 ? (
        <Dashboard />
      ) : (
        <Login />
      )}
    </MagicProvider>
  );
}
