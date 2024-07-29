import React from "react";
import Spacer from "@/components/ui/Spacer";
import { LoginProps } from "@/utils/types";
import UserInfo from "./cards/UserInfoCard";

export default function Dashboard({ token, setToken }: LoginProps) {
  return (
    <div className="home-page">
      <div className="cards-container">
        <UserInfo token={token} setToken={setToken} />
        <Spacer size={10} />
      </div>
    </div>
  );
}
