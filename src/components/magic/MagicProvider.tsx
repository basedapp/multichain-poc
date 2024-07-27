import { getChainId, getRPCUrl, isSolana, Network } from "@/utils/network";
import { OAuthExtension } from "@magic-ext/oauth";
import { SolanaExtension } from "@magic-ext/solana";
import { Magic as MagicBase } from "magic-sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Web3 from "web3";

export type Magic = MagicBase<OAuthExtension[]>;

type UserInfo = {
  address: string;
  network: Network;
};

type MagicContextType = {
  magic?: Magic;
  magicClients: Partial<Record<Network, Magic>>;
  web3Clients: Partial<Record<Network, Web3>>;
  onLogin: () => void;
};

const MagicContext = createContext<MagicContextType>({
  magic: undefined,
  magicClients: {},
  web3Clients: {},
  onLogin: () => { },
});

export const useMagic = () => useContext(MagicContext);

type MagicProviderProps = {
  children: ReactNode;
  supportedNetworks: Network[];
};

export const MagicProvider = ({ children, supportedNetworks }: MagicProviderProps) => {
  const [magicClients, setMagicClients] = useState<Partial<Record<Network, Magic>>>({});
  const [web3Clients, setWeb3Clients] = useState<Partial<Record<Network, Web3>>>({});
  const [magic, setMagic] = useState<Magic | undefined>(undefined);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      throw new Error("NEXT_PUBLIC_MAGIC_API_KEY is not set");
    }
    const newMagicClients: Partial<Record<Network, Magic>> = {};
    const newWeb3Clients: Partial<Record<Network, Web3>> = {};

    supportedNetworks.forEach((network) => {
      if (!network) return;

      let magic: Magic;
      if (isSolana(network)) {
        magic = new MagicBase(
          process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
          {

            extensions: [
              new OAuthExtension(),
              new SolanaExtension({
                rpcUrl: getRPCUrl(network)
              })
            ],
          }
        );
      } else {
        const chainId = getChainId(network);
        magic = new MagicBase(
          process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
          {
            network: {
              rpcUrl: getRPCUrl(network),
              chainId: chainId,
            },
            extensions: [
              new OAuthExtension(),
            ],
          }
        );
        newWeb3Clients[network] = new Web3((magic as any).rpcProvider);
      }

      newMagicClients[network] = magic;

    });

    setMagicClients(newMagicClients);
    setWeb3Clients(newWeb3Clients);
    setMagic(newMagicClients[process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network]);

  }, [supportedNetworks]);

  const onLogin = async () => {
    console.log("onLogin");
    for (const network of supportedNetworks) {
      const magic = magicClients[network];
      if (!magic) continue;
      const userInfo = await magic.user.getInfo();
      console.log(`network: ${network}, userInfo`, userInfo);
    }
  };

  const value = useMemo(() => {
    return {
      magicClients,
      web3Clients,
      magic,
      onLogin
    };
  }, [magicClients, web3Clients]);

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
};
