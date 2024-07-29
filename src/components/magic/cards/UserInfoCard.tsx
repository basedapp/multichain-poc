import { useCallback, useEffect, useMemo, useState } from "react";
import Divider from "@/components/ui/Divider";
import { LoginProps } from "@/utils/types";
import { logout } from "@/utils/common";
import { useMagic } from "../../../providers/MagicProvider";
import Card from "@/components/ui/Card";
import CardLabel from "@/components/ui/CardLabel";
import Spinner from "@/components/ui/Spinner";
import { getNetworkName, getNetworkToken, Network } from "@/utils/network";
import { useUserTokens } from "@/hooks/useUserTokens";

const UserInfo = ({ token, setToken }: LoginProps) => {
  const { magic, networkInfos } = useMagic();

  const [balance, setBalance] = useState("...");
  const [copied, setCopied] = useState("Copy");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [publicAddress] = useState(localStorage.getItem("user"));
  const { data } = useUserTokens();

  const disconnect = useCallback(async () => {
    if (magic) {
      await logout(setToken, magic);
    }
  }, [magic, setToken]);

  return (
    <Card>
      <CardLabel
        leftHeader="Status"
        rightAction={<div onClick={disconnect}>Disconnect</div>}
        isDisconnect
      />
      <div className="flex-row">
        <div className="green-dot" />
        <div className="connected">Connected to {getNetworkName()}</div>
      </div>
      <Divider />
      {networkInfos && Object.keys(networkInfos).map((network) => (
        <div key={network}>
          <CardLabel
            leftHeader={getNetworkName(network as Network)}
          />
          <div className="code">
            {networkInfos[network as Network]?.address}
          </div>
        </div>
      ))}
      <Divider />
      <CardLabel leftHeader="Token Balances" />
      {data ? (
        <div className="code">
          {Object.entries(data).map(([network, tokens]) => (
            <div key={network}>
              <h4 className="font-bold">
                {getNetworkName(network as Network)}
              </h4>
              {Object.entries(tokens).map(([symbol, tokenBalance]) => (
                <div key={symbol}>
                  {symbol}: {tokenBalance}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Spinner />
      )}
    </Card>
  );
};

export default UserInfo;
