import { networksInfoAtom, tokenAtom, UserNetworkInfo } from "@/state/magic-atoms";
import { getChainId, getRPCUrl, isSolana, Network } from "@/utils/network";
import { OAuthExtension } from "@magic-ext/oauth";
import { SolanaExtension } from "@magic-ext/solana";
import { useAtom } from "jotai";
import { Magic as MagicBase } from "magic-sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Web3 from "web3";

export type Magic = MagicBase<OAuthExtension[]>;


type MagicContextType = {
  magic?: Magic;
  magicClients: Partial<Record<Network, Magic>>;
  web3Clients: Partial<Record<Network, Web3>>;
  networkInfos: Partial<Record<Network, UserNetworkInfo>>;
  onLogin: () => void;
  onLogout: () => void;
};

const MagicContext = createContext<MagicContextType>({
  magic: undefined,
  magicClients: {},
  web3Clients: {},
  networkInfos: {},
  onLogin: () => { },
  onLogout: () => { },
});

export const useMagic = () => useContext(MagicContext);

type MagicProviderProps = {
  children: ReactNode;
  supportedNetworks: Network[];
};

export const MagicProvider = ({ children, supportedNetworks }: MagicProviderProps) => {
  const magicClientsRef = useRef<Partial<Record<Network, Magic>>>({});
  const [web3Clients, setWeb3Clients] = useState<Partial<Record<Network, Web3>>>({});

  const [networkInfos, setNetworkInfos] = useAtom(networksInfoAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const [magic, setMagic] = useState<Magic | undefined>(undefined);

  const handleLogin = async (network: Network) => {
    const magic = magicClientsRef.current[network];
    if (!magic) {
      console.log("No magic client for network", network);
      return;
    }
    const userInfo = await magic.user.getInfo();
    console.log(`network: ${network}, userInfo`, userInfo);

    setNetworkInfos((prev) => ({
      ...prev,
      [network]: {
        address: userInfo?.publicAddress,
        network: network,
      }
    }));
  };


  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      throw new Error("NEXT_PUBLIC_MAGIC_API_KEY is not set");
    }

    console.log("Init magic clients")
    const newMagicClients: Partial<Record<Network, Magic>> = {};
    const newWeb3Clients: Partial<Record<Network, Web3>> = {};

    supportedNetworks.forEach((network) => {
      if (!network) return;
      console.log("Initialise network", network);
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
        // evm networks
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

      magic.user.isLoggedIn().then((isLoggedIn) => {
        console.log(`network: ${network}, isLoggedIn`, isLoggedIn);
        if (isLoggedIn) {
          handleLogin(network);
        }
      });

    });

    console.log("nMagicClients", Object.keys(newMagicClients).length);
    magicClientsRef.current = newMagicClients;
    setWeb3Clients(newWeb3Clients);
    setMagic(newMagicClients[process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network]);

  }, [supportedNetworks]);


  const onLogin = async () => {
    console.log("onLogin");
    for (const network of supportedNetworks) {
      handleLogin(network);
    }
  };

  const onLogout = async () => {
    console.log("onLogout");
    setNetworkInfos({} as Record<Network, UserNetworkInfo>);
    setToken(null);
  };

  const value = useMemo(() => {
    return {
      magicClients: magicClientsRef.current,
      web3Clients,
      networkInfos,
      magic,
      onLogin,
      onLogout
    };
  }, [magicClientsRef.current, web3Clients, magic, networkInfos, onLogin]);

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
};
