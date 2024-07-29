import { useSearchParams } from "next/navigation";
import { LoginMethod, MagicInfo, magicInfoAtom, networksInfoAtom, UserNetworkInfo } from "@/state/magic-atoms";
import { getChainId, getRPCUrl, isSolana, Network } from "@/utils/network";
import { OAuthExtension, OAuthProvider } from "@magic-ext/oauth";
import { SolanaExtension } from "@magic-ext/solana";
import { useAtom } from "jotai";
import { Magic as MagicBase, MagicUserMetadata, UserInfo } from "magic-sdk";
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
import { useHostname } from "@/hooks/useHostname";

export type Magic = MagicBase<OAuthExtension[]>;

type MagicContextType = {
  magic?: Magic;
  magicClients: Partial<Record<Network, Magic>>;
  web3Clients: Partial<Record<Network, Web3>>;
  networkInfos: Partial<Record<Network, UserNetworkInfo>>;
  magicInfo: MagicInfo;
  oauthLogin: (provider: OAuthProvider) => void;
  onLogout: () => void;
  isAuthLoading: boolean;
  isLoggedIn: boolean;
};

const MagicContext = createContext<MagicContextType>({
  magic: undefined,
  magicClients: {},
  web3Clients: {},
  networkInfos: {},
  magicInfo: undefined,
  oauthLogin: (provider: OAuthProvider) => { },
  onLogout: () => { },
  isAuthLoading: false,
  isLoggedIn: false,
});

export const useMagic = () => useContext(MagicContext);

type MagicProviderProps = {
  children: ReactNode;
  supportedNetworks: Network[];
};

export const MagicProvider = ({ children, supportedNetworks }: MagicProviderProps) => {

  const searchParams = useSearchParams();
  const hasOauthLoginParams = searchParams?.has("magic_oauth_request_id");

  const hostname = useHostname();

  const magicClientsRef = useRef<Partial<Record<Network, Magic>>>({});
  const [web3Clients, setWeb3Clients] = useState<Partial<Record<Network, Web3>>>({});


  const [networkInfos, setNetworkInfos] = useAtom(networksInfoAtom);
  const [magicInfo, setMagicInfo] = useAtom(magicInfoAtom);
  const [magic, setMagic] = useState<Magic | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const updateUserNetworkInfo = async (network: Network) => {
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


  // Initialise multiple magic clients
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAGIC_API_KEY) {
      throw new Error("NEXT_PUBLIC_MAGIC_API_KEY is not set");
    }

    if (Object.keys(magicClientsRef.current).length == supportedNetworks.length) {
      console.log("Skipping magic clients initialisation");
      return;
    }

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
        syncLoggedInState(isLoggedIn);
        updateUserNetworkInfo(network);
      });

    });

    console.log("nMagicClients", Object.keys(newMagicClients).length);
    magicClientsRef.current = newMagicClients;
    setWeb3Clients(newWeb3Clients);
    setMagic(newMagicClients[process.env.NEXT_PUBLIC_DEFAULT_NETWORK as Network]);

  }, [supportedNetworks]);


  useEffect(() => {
    const redirectOauth = async () => {
      try {
        if (!magic) return;
        console.log("Getting oauth redirect result");
        const result = await magic.oauth.getRedirectResult();
        if (!result) return;
        console.log("social login metadata", result);
        await onLogin(result.magic.idToken, result.magic.userMetadata, "SOCIAL");
      } catch (e) {
        console.log('social login error: ' + e);
      } finally {
        setIsAuthLoading(false);
      }
    };

    if (hasOauthLoginParams) {
      redirectOauth();
    }
  }, [magic]);

  const syncLoggedInState = async (isLoggedIn: boolean) => {
    if (!!magicInfo?.isLoggedIn === isLoggedIn) return;

    if (isLoggedIn) {
      onLogin();
    } else {
      onLogout();
    }
  }

  const oauthLogin = async (provider: OAuthProvider) => {
    if (!magic) return;
    try {
      await magic.oauth.loginWithRedirect({
        provider: provider /* 'google', 'facebook', 'apple', or 'github' */,
        redirectURI: hostname,
        scope: ["openid"] /* optional */,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onLogin = async (token?: string, metadata?: MagicUserMetadata, loginMethod?: LoginMethod) => {
    console.log("onLogin");
    setMagicInfo({
      token,
      publicAddress: metadata?.publicAddress ?? "",
      loginMethod,
      isLoggedIn: true,
    });
    for (const network of supportedNetworks) {
      updateUserNetworkInfo(network);
    }
  };

  const onLogout = async () => {
    console.log("onLogout");
    setNetworkInfos({} as Record<Network, UserNetworkInfo>);
    setMagicInfo(undefined);
    if (await magic?.user.isLoggedIn()) {
      await magic?.user.logout();
    }
    setIsAuthLoading(false);
  };

  const value = useMemo(() => {
    return {
      magicClients: magicClientsRef.current,
      web3Clients,
      networkInfos,
      magic,
      onLogout,
      magicInfo,
      isAuthLoading,
      oauthLogin,
      isLoggedIn: magicInfo?.isLoggedIn ?? false,
    };
  }, [magicClientsRef.current, web3Clients, magic, networkInfos, onLogin, magicInfo, onLogout, isAuthLoading, setIsAuthLoading]);

  return (
    <MagicContext.Provider value={value}>{children}</MagicContext.Provider>
  );
};
