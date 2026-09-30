import { SELECTORS, type ParamType } from "./selectors.ts";

export interface Decoded {
  selector: string;
  name: string | null;
  args: { name: string; type: ParamType | "word"; value: string }[];
  warnings: string[];
}

const MAX = (1n << 256n) - 1n;

function decodeWord(word: string, type: ParamType): string {
  if (type === "address") return "0x" + word.slice(24);
  if (type === "bool") return BigInt("0x" + word) === 0n ? "false" : "true";
  return BigInt("0x" + word).toString();
}

export function decode(calldata: string): Decoded {
  const hex = calldata.toLowerCase().replace(/^0x/, "");
  if (hex.length < 8 || !/^[0-9a-f]*$/.test(hex)) throw new Error("calldata must be hex with a 4-byte selector");
  const selector = hex.slice(0, 8);
  const body = hex.slice(8);
  const words: string[] = [];
  for (let i = 0; i + 64 <= body.length; i += 64) words.push(body.slice(i, i + 64));

  const sig = SELECTORS[selector];
  if (!sig) {
    return {
      selector,
      name: null,
      args: words.map((w, i) => ({ name: `word${i}`, type: "word", value: "0x" + w })),
      warnings: [],
    };
  }
  if (words.length < sig.params.length) throw new Error(`${sig.name} expects ${sig.params.length} words, got ${words.length}`);

  const args = sig.params.map(([name, type], i) => ({ name, type, value: decodeWord(words[i], type) }));
  const warnings: string[] = [];
  if (sig.name === "approve" || sig.name === "increaseAllowance") {
    const amount = BigInt(args[1].value);
    if (amount >= MAX / 2n) warnings.push("unlimited approval, the spender can move all current and future tokens");
  }
  if (sig.name === "setApprovalForAll" && args[1].value === "true") {
    warnings.push("operator gets control of every token in this collection");
  }
  return { selector, name: sig.name, args, warnings };
}
