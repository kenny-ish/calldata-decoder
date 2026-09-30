export type ParamType = "address" | "uint256" | "bool";

export interface Signature {
  name: string;
  params: [string, ParamType][];
}

export const SELECTORS: Record<string, Signature> = {
  a9059cbb: { name: "transfer", params: [["to", "address"], ["amount", "uint256"]] },
  "095ea7b3": { name: "approve", params: [["spender", "address"], ["amount", "uint256"]] },
  "23b872dd": { name: "transferFrom", params: [["from", "address"], ["to", "address"], ["amount", "uint256"]] },
  "39509351": { name: "increaseAllowance", params: [["spender", "address"], ["addedValue", "uint256"]] },
  "42842e0e": { name: "safeTransferFrom", params: [["from", "address"], ["to", "address"], ["tokenId", "uint256"]] },
  a22cb465: { name: "setApprovalForAll", params: [["operator", "address"], ["approved", "bool"]] },
  d0e30db0: { name: "deposit", params: [] },
  "2e1a7d4d": { name: "withdraw", params: [["amount", "uint256"]] },
};
