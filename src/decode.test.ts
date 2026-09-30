import { test } from "node:test";
import assert from "node:assert/strict";
import { decode } from "./decode.ts";

const addr = "000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045";
const word = (n: bigint) => n.toString(16).padStart(64, "0");

test("transfer", () => {
  const d = decode("0xa9059cbb" + addr + word(1_000_000n));
  assert.equal(d.name, "transfer");
  assert.equal(d.args[0].value, "0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
  assert.equal(d.args[1].value, "1000000");
  assert.deepEqual(d.warnings, []);
});

test("unlimited approve is flagged", () => {
  const d = decode("0x095ea7b3" + addr + "f".repeat(64));
  assert.equal(d.warnings.length, 1);
});

test("setApprovalForAll true is flagged, false is not", () => {
  assert.equal(decode("0xa22cb465" + addr + word(1n)).warnings.length, 1);
  assert.equal(decode("0xa22cb465" + addr + word(0n)).warnings.length, 0);
});

test("unknown selector returns raw words", () => {
  const d = decode("0xdeadbeef" + word(7n));
  assert.equal(d.name, null);
  assert.equal(d.args[0].value, "0x" + word(7n));
});

test("rejects garbage and short calldata", () => {
  assert.throws(() => decode("0x12"));
  assert.throws(() => decode("0xa9059cbb" + addr));
});
