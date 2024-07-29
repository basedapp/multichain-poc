import { atom } from "jotai";
import { atomFamily, atomWithStorage } from "jotai/utils";
import { Network } from "@/utils/network";

export type LoginMethod = "SOCIAL" | "EMAIL" | "SMS";
export type MagicInfo =
  | {
      isLoggedIn: boolean;
      publicAddress?: string;
      loginMethod?: LoginMethod;
      token?: string;
    }
  | undefined;

export const magicInfoAtom = atomWithStorage<MagicInfo>(
  "magic-info",
  undefined
);

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
