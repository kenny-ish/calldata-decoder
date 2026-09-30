import { parseArgs } from "node:util";
import { decode } from "./decode.ts";
import { SELECTORS } from "./selectors.ts";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { tx: { type: "string" }, rpc: { type: "string", default: "https://ethereum-rpc.publicnode.com" } },
});

let input = positionals[0];
if (values.tx) {
  const res = await fetch(values.rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getTransactionByHash", params: [values.tx] }),
  });
  const tx = ((await res.json()) as { result?: { input: string; to: string } }).result;
  if (!tx) {
    console.error("transaction not found");
    process.exit(1);
  }
  console.log(`to ${tx.to}`);
  input = tx.input;
}
if (!input) {
  console.error("usage: node src/index.ts <calldata> | --tx <hash> [--rpc URL]");
  process.exit(2);
}
if (input === "0x") {
  console.log("empty calldata: plain ETH transfer");
  process.exit(0);
}

try {
  const d = decode(input);
  if (d.name) {
    const sig = SELECTORS[d.selector];
    console.log(`${d.name}(${sig.params.map(([n, t]) => `${t} ${n}`).join(", ")})`);
  } else {
    console.log(`unknown selector 0x${d.selector}`);
  }
  const width = Math.max(0, ...d.args.map((a) => a.name.length));
  for (const a of d.args) console.log(`  ${a.name.padEnd(width)}  ${a.value}`);
  for (const w of d.warnings) console.log(`  WARNING: ${w}`);
} catch (e) {
  console.error((e as Error).message);
  process.exit(1);
}
