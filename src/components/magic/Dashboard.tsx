import React from "react";
import Spacer from "@/components/ui/Spacer";
import UserInfo from "./cards/UserInfoCard";

export default function Dashboard() {
  return (
    <div className="home-page">
      <div className="cards-container">
        <UserInfo />
        <Spacer size={10} />
      </div>
    </div>
  );
}
