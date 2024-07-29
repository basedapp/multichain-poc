import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { Network } from "@/utils/network";

export const tokenAtom = atomWithStorage<string>("magic-token", "");

export type UserNetworkInfo = {
  address: string;
  network: Network;
} | null;

export const networksInfoAtom = atomWithStorage<
  Record<Network, UserNetworkInfo>
>("networks-info", {} as Record<Network, UserNetworkInfo>);

export const networksInfoFamily = atomFamily(
  (network: Network) => atom((get) => get(networksInfoAtom)[network]),
  (a, b) => a === b
);
