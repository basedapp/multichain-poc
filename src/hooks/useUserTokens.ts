import { useMagic } from "@/components/magic/MagicProvider";
import { getRPCUrl, Network } from "@/utils/network";
import { useState } from "react";
import useSWR from "swr";
import { createPublicClient, http, parseAbi, PublicClient } from "viem";
import { polygon, sepolia, mainnet, polygonAmoy } from "viem/chains";
import { ethers } from "ethers";

type Token = {
  address: string;
  decimals: number;
  symbol: string;
  balance?: string;
};

const SupportedTokens = {
  [Network.POLYGON]: {
    USDC: {
      address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      decimals: 6,
      symbol: "USDC",
    },
    USDT: {
      address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      decimals: 6,
      symbol: "USDT",
    },
    DAI: {
      address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      decimals: 18,
      symbol: "DAI",
    },
    WBTC: {
      address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      decimals: 8,
      symbol: "WBTC",
    },
    WETH: {
      address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      decimals: 18,
      symbol: "WETH",
    },
  },
  [Network.ETHEREUM]: {
    USDC: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimals: 6,
      symbol: "USDC",
    },
    USDT: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimals: 6,
      symbol: "USDT",
    },
    DAI: {
      address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      decimals: 18,
      symbol: "DAI",
    },
  },
  [Network.ETHEREUM_SEPOLIA]: {
    CHAINLINK: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      decimals: 18,
      symbol: "LINK",
    },
  },
};

export function useUserTokens() {
  const [publicAddress] = useState(localStorage.getItem("user"));

  const { data, error, ...args } = useSWR(
    publicAddress ? `${publicAddress}/tokens` : null,
    async () => {
      const clients: {
        [network in Network]?: PublicClient;
      } = {};

      for (const network of Object.keys(SupportedTokens)) {
        clients[network as Network] = createPublicClient({
          chain: getViemChain(network as Network),
          transport: http(getRPCUrl(network as Network)),
        });
      }

      const allTokenBalances: Record<string, Record<string, string>> = {};

      for (const [network, tokens] of Object.entries(SupportedTokens)) {
        const balanceCallData = Object.values(tokens).map((token: Token) => {
          return {
            address: token.address as `0x${string}`,
            abi: parseAbi([
              "function balanceOf(address owner) view returns (uint256)",
            ]),
            functionName: "balanceOf",
            args: [publicAddress as `0x${string}`],
          } as const;
        });
        const client = clients[network as Network];
        if (!client) continue;
        try {
          const balances: bigint[] = await client.multicall({
            contracts: balanceCallData,
            allowFailure: false,
          });

          const tokenBalance = balances.reduce<Record<string, string>>(
            (acc, balance, index) => {
              const token = Object.values(tokens)[index];
              const formattedBalance = ethers.formatUnits(
                balance.toString(),
                token.decimals
              );
              acc[token.symbol] = formattedBalance;
              return acc;
            },
            {}
          );

          allTokenBalances[network] = tokenBalance;
        } catch (e) {
          console.log(e);
        }
      }

      return allTokenBalances;
    },
    { revalidateOnFocus: false }
  );

  return { data, error, ...args };
}

function getViemChain(network: Network) {
  switch (network) {
    case Network.POLYGON_AMOY:
      return polygonAmoy;
    case Network.POLYGON:
      return polygon;
    case Network.ETHEREUM:
      return mainnet;
    case Network.ETHEREUM_SEPOLIA:
      return sepolia;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}
