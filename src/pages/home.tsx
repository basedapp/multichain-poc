import { useMagic } from "../providers/MagicProvider";

import Login from "@/components/magic/Login";
import Dashboard from "@/components/magic/Dashboard";


export default function Home() {
    const { isLoggedIn } = useMagic();

    return isLoggedIn ? (
        <Dashboard />
    ) : (
        <Login />
    )
}
