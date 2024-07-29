import { MagicProvider } from "../providers/MagicProvider";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/components/magic/Login";
import Dashboard from "@/components/magic/Dashboard";
import { Network } from "@/utils/network";

const supportedNetworks = [Network.POLYGON, Network.ARBITRUM, Network.SOLANA];

export default function Home() {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") ?? "");
  }, [setToken]);

  return (
    <MagicProvider supportedNetworks={supportedNetworks}>
      <ToastContainer />
      {token.length > 0 ? (
        <Dashboard token={token} setToken={setToken} />
      ) : (
        <Login token={token} setToken={setToken} />
      )}
    </MagicProvider>
  );
}
