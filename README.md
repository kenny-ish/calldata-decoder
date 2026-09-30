# calldata-decoder

Decodes transaction calldata, or the calldata of a transaction hash, and warns about risky approvals.
Useful before signing something, or when looking into what a past transaction did.

```bash
node src/index.ts 0x095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba3ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
# approve(address spender, uint256 amount)
#   spender  0x000000000022d473030f116ddee9f6b43ac78ba3
#   amount   115792089237316195423570985008687907853269984665640564039457584007913129639935
#   WARNING: unlimited approval, the spender can move all current and future tokens

node src/index.ts --tx 0x<hash> --rpc https://ethereum-rpc.publicnode.com
```

Known selectors are ERC-20 `transfer`, `approve`, `transferFrom` and `increaseAllowance`, ERC-721
`safeTransferFrom` and `setApprovalForAll`, and WETH `deposit` and `withdraw`. For an unknown
selector the arguments are printed as raw 32-byte words, which is often enough to spot an address
or an amount.

It warns about:

- `approve` or `increaseAllowance` with `type(uint256).max` or something close to it
- `setApprovalForAll(operator, true)`, which lets the operator move every NFT of that collection

The selectors are listed in `src/selectors.ts`, one line each.

```bash
npm test
```
