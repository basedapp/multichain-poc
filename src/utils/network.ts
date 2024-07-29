export enum Network {
  POLYGON_AMOY = "polygon-amoy",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  ARBITRUM_SEPOLIA = "arbitrum-sepolia",
  BASE = "base",
  BASE_SEPOLIA = "base-sepolia",
  ETHEREUM_SEPOLIA = "ethereum-sepolia",
  ETHEREUM = "ethereum",
  SOLANA = "solana",
  SOLANA_DEVNET = "solana-devnet",
}

export const getRPCUrl = (network: Network) => {
  switch (network) {
    case Network.POLYGON:
      return "https://polygon-rpc.com/";
    case Network.POLYGON_AMOY:
      return "https://rpc-amoy.polygon.technology/";
    case Network.ETHEREUM_SEPOLIA:
      return "https://eth-sepolia.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0";
    case Network.ETHEREUM:
      return "https://eth-mainnet.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0";
    case Network.BASE:
      return "https://base.drpc.org/";
    case Network.BASE_SEPOLIA:
      return "https://sepolia.base.org/";
    case Network.ARBITRUM:
      return "https://arbitrum.llamarpc.com/";
    case Network.ARBITRUM_SEPOLIA:
      return "https://sepolia-rollup.arbitrum.io/rpc/";
    case Network.SOLANA:
      return "https://api.solana.com";
    case Network.SOLANA_DEVNET:
      return "https://api.devnet.solana.com";
    default:
      throw new Error("Network not supported");
  }
};

export const getNetworkUrl = () => {
  switch (process.env.NEXT_PUBLIC_DEFAULT_NETWORK) {
    case Network.POLYGON:
      return "https://polygon.drpc.org/";
    case Network.POLYGON_AMOY:
      return "https://rpc-amoy.polygon.technology/";
    case Network.ARBITRUM:
      return "https://arbitrum.llamarpc.com/";
    case Network.ARBITRUM_SEPOLIA:
      return "https://sepolia-rollup.arbitrum.io/rpc/";
    case Network.BASE:
      return "https://base.drpc.org/";
    case Network.BASE_SEPOLIA:
      return "https://sepolia.base.org/";
    case Network.POLYGON_AMOY:
      return "https://rpc-amoy.polygon.technology/";
    case Network.ETHEREUM_SEPOLIA:
      return "https://eth-sepolia.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0";
    case Network.ETHEREUM:
      return "https://eth-mainnet.g.alchemy.com/v2/fYFybLQFR9Zr2GCRcgALmAktStFKr0i0";
    case Network.SOLANA:
      return "https://api.devnet.solana.com";
    default:
      throw new Error("Network not supported");
  }
};

export const isSolana = (network: Network) => {
  return network === Network.SOLANA || network === Network.SOLANA_DEVNET;
};

export const getChainId = (network: Network) => {
  switch (network) {
    case Network.POLYGON:
      return 137;
    case Network.POLYGON_AMOY:
      return 80002;
    case Network.ETHEREUM_SEPOLIA:
      return 11155111;
    case Network.ETHEREUM:
      return 1;
    case Network.BASE:
      return 8453;
    case Network.BASE_SEPOLIA:
      return 84532;
    case Network.ARBITRUM:
      return 42161;
    case Network.ARBITRUM_SEPOLIA:
      return 421613;
    default:
      throw new Error(`Network not supported, ${network}`);
  }
};

export const getNetworkToken = (network: Network) => {
  switch (network) {
    case Network.POLYGON_AMOY:
    case Network.POLYGON:
      return "MATIC";
    case Network.ETHEREUM:
    case Network.ETHEREUM_SEPOLIA:
      return "ETH";
    case Network.BASE:
    case Network.BASE_SEPOLIA:
      return "ETH";
    case Network.ARBITRUM:
    case Network.ARBITRUM_SEPOLIA:
      return "ETH";
    case Network.SOLANA:
    case Network.SOLANA_DEVNET:
      return "SOL";
    default:
      throw new Error(`Network not supported, ${network}`);
  }
};

export const getFaucetUrl = (network: Network) => {
  switch (network) {
    case Network.POLYGON_AMOY:
      return "https://faucet.polygon.technology/";
    case Network.ETHEREUM_SEPOLIA:
      return "https://sepoliafaucet.com/";
    default:
      throw new Error("Network not supported");
  }
};

export const getNetworkName = (network?: Network) => {
  switch (network || process.env.NEXT_PUBLIC_DEFAULT_NETWORK) {
    case Network.POLYGON:
      return "Polygon (Mainnet)";
    case Network.POLYGON_AMOY:
      return "Polygon (Amoy)";
    case Network.ETHEREUM_SEPOLIA:
      return "Ethereum (Sepolia)";
    case Network.ETHEREUM:
      return "Ethereum (Mainnet)";
    case Network.BASE:
      return "Base (Mainnet)";
    case Network.BASE_SEPOLIA:
      return "Base (Sepolia)";
    case Network.ARBITRUM:
      return "Arbitrum (Mainnet)";
    case Network.ARBITRUM_SEPOLIA:
      return "Arbitrum (Sepolia)";
    case Network.SOLANA:
      return "Solana (Mainnet)";
    case Network.SOLANA_DEVNET:
      return "Solana (Devnet)";
    default:
      throw new Error("Network not supported");
  }
};

export const getBlockExplorer = (network: Network, address: string) => {
  switch (network) {
    case Network.POLYGON:
      return `https://polygonscan.com/address/${address}`;
    case Network.POLYGON_AMOY:
      return `https://www.oklink.com/amoy/address/${address}`;
    case Network.ETHEREUM:
      return `https://etherscan.io/address/${address}`;
    case Network.ETHEREUM_SEPOLIA:
      return `https://sepolia.etherscan.io/address/${address}`;
    default:
      throw new Error("Network not supported");
  }
};
