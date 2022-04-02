# ➡ DecentraMix.io Solidity Smart Contracts

![](https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/.gitbook/assets/4.png)

`To get a better understanding of DecentraMix, we recommend to read about the technologies and privacy protocols that DeMix is built upon: [Zero-Knowledge Protocol](broken-reference) | [zkSNARKs ](https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/zero-knowledge-protocol-zk/what-are-zksnarks.md)| [Trusted Setup](https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/zero-knowledge-protocol-zk/trusted-setup-ceremony/) | and if you really want to dive into the zk protocol, you can [create your own zkSNARK circuit](https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/zero-knowledge-protocol-zk/create-your-own-zksnark-circuit/).`

By default, your entire blockchain transaction history and balances are public. All transactions can be seen on block explorers like BSCScan. Anyone who knows that you own a particular address can quickly view your payments, trace the source of your funds, calculate your holdings, and analyze your on-chain activity. On almost all the most populated blockchains, every transaction, every wallet address, every piece of on-chain data is visible to anyone who wishes to see it. That means that like the blockchain, you as an individual are exposed.But what if you did not want your history and balances to be publicly viewed by everyone? What if you wanted anonymity and privacy when it came to your transactions? What if you don't want every financial step of yours to be mapped, tracked, and sold against your will? **This is why DecentraWorld was created, we're simply restoring privacy and financial freedom to humanity. We will not allow governments to invade our, or anyone else's privacy.**&#x20;

 **DecentraMix (DEMIX), product of DecentraWorld's ecosystem, is a cross-chain, non-custodial, universal privacy-preserving protocol with the decentralized governance. DecentraMix applies zkSNARKs to enable transactional privacy for all DeFi components by breaking the on-chain link between depositor and recipient addresses. On other chains,** It uses the smart contracts within this repo, that accepts coins/tokens deposits, which can be withdrawn by a different address. Whenever an asset is withdrawn from DecentraWorld, there is no way to link the withdrawal to the deposit for absolute privacy. On our blockchain, privacy is engraved into each and every transaction by default. We do support compliance across our ecosystem, to keep our platform legal for residents of all countries, we created a compliance page that can prove the origin of the funds sent/received as long as the encrypted note that was given to you at the time of sending/receiving tokens, was saved.&#x20;


# 💱 How Does DecentraMix Work?

To explain how [**DecentraMix**](https://decentramix.io) **** works we will use Jenny. Jenny decides that she wants to buy something with a token, she then goes on to DecentraMix.io, and deposits that token into the DeMixFactory contract. Jenny will then wait 24+ hours, per our recommendation to ensure privacy & anonymity.&#x20;

![](<https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/.gitbook/assets/Welcome.png>)

In the meantime, the DeMixFactory.sol contract which accepts your token, will mix your token in between thousands of wallets, all together with other deposits made after yours. Making it impossible to know which token in the contract belongs to who.

Jenny understands how zero-knowledge ([zkSNARK](../zero-knowledge-protocol-zk/what-are-zksnarks.md)) privacy protocols work, she read our documentations. She knows that as long as she stored the encrypted note given to her during the deposit, her funds are safe within the mixing contract, and the only way to withdraw her token is by using her encrypted note. In the meantime, there are more users depositing tokens into DecentraMix, making Jenny's withdrawal more private than ever before.

![](<https://github.com/DecentraWorldDEWO/Documentation/blob/gitbook/.gitbook/assets/8.png>)

Once 24 hours have passed, Jenny returns to DecentraMix.io to withdraw her funds into a new wallet. Jenny successfully withdrew her token into a new wallet, without any trace to the original source of the funds, and with full privacy since she followed all of our [Anonymity Tips.](broken-reference) Now Jenny can trade, shop, transact, etc, but this time, no one can track her financial value, nor her crypto activity.

**Be like Jenny!** Use [DecentraMix.io](https://decentramix.io)









# Instructions to deploy DecentraMixFactory Contracts

1. Navigate to `demix-core-contracts` folder.
2. Download this folder to your local machine.








## Requirements

1. `node v16.14.2(LTS)`
2. `yarn @Latest`
3. `npm @Latest`
4. `2. npm install -g npx`






## Initialize

1. `npm install`
2. `npm run build`







## Contracts in order: (migrations)

2 = Hasher.sol
3 = Verifier.sol
4 = DeMixFactory.sol 
5 = DeMixToken.sol
6-17 = All Pairs on BSC / Testnet
22-33 = All Pairs on CRO
40-51 = All Pairs on FTM
56-67 = All Pairs on MATIC
72-83 = All Pairs on AVAX
88-99 = All Pairs on ETH
104 = Multicall.sol
105 = DeMixProxyLight.sol
106 = Echoer.sol
(We left 4 slots in between pairs for the DEWO token contracts)
`npx truffle migrate --network $network —reset --f x --to x`  x = migrations | $network = network name







## Deploy DeMixFactory

1. `cp .env.example .env`
2. Edit `.env` parameters
3. `npx truffle migrate --network $network --reset --f 2 --to 4` (Deploy Verifier, Hasher, 1st Pool)
4. Edit `.env` parameters again for the next pool
5. `npx truffle migrate --network $network --reset --f 4 --to 4`
`Note:  Repeat the process for as many pool contracts as you need, DeMix uses 4 pools for each native token`







## Deploy a token (BUSD,USDC,BTCB)

1. `cp .env.example .env`
2. Edit `.env` parameters
3. `npx truffle migrate --network $network --reset --f 5 —to 5` 
4. Edit `.env` parameters again for the next pool
5. `npx truffle migrate --network $network --reset --f 5 —to 5`
`Note:  Repeat the process for as many pool contracts as you wish, DeMix uses 4 pools for each token`







## Deploy All Contracts For DecentraMix.io (On All Supported Chains)

1. `cp .env.example .env`
2. Edit `.env` private key parameters, you don't need to change anything else for this method.
3. BSC: `npx truffle migrate --network bsc --reset --f 2 --to 3 &&  npx truffle migrate --network bsc --reset --f 6 --to 17 && npx truffle migrate --network bsc --reset --f 104 --to 106 `
4. Testnet: `npx truffle migrate --network testnet --reset --f 2 --to 3 &&  npx truffle migrate --network testnet --reset --f 6 --to 17 npx truffle migrate --network bsc --reset --f 6 --to 17 
5. CRO: `npx truffle migrate --network cronos --reset --f 2 --to 3 &&  npx truffle migrate --network cronos --reset --f 22 --to 33 npx truffle migrate --network bsc --reset --f 6 --to 17 
6. FTM: `npx truffle migrate --network fantom --reset --f 2 --to 3 &&  npx truffle migrate --network fantom --reset --f 40 —to 51 npx truffle migrate --network bsc --reset --f 6 --to 17 
7. MATIC: `npx truffle migrate --network matic --reset --f 2 --to 3 &&  npx truffle migrate --network matic --reset --f 56 —to 67 npx truffle migrate --network bsc --reset --f 6 --to 17 
8. AVAX: `npx truffle migrate --network avalanche --reset --f 2 --to 3 &&  npx truffle migrate --network avalanche --reset --f 72 —to 83 npx truffle migrate --network bsc --reset --f 6 --to 17 
9. ETH: `npx truffle migrate --network mainnet --reset --f 2 --to 3 &&  npx truffle migrate --network mainnet --reset --f 88 —to 99 npx truffle migrate --network bsc --reset --f 6 --to 17 









## Verify Through Truffle

1. `npm install -D truffle-plugin-verify@0.5.24`
2. `cp secret.json.example secret.json`
3. Update your explorer API keys in `secret.json`
4. `npx truffle run verify ContractName@0xaddress AnotherContract@0xaddress --network $NetworkName`









## Verify DeMixFactory & DeMixToken Through Explorer

1. `npm install truffle-flattener -g`
2. `npx truffle-flattener ./contracts/DeMixFactory.sol > ./contracts/DeMixFactory_Flat.sol`
3. `npx truffle-flattener ./contracts/DeMixToken.sol > ./contracts/DeMixToken_Flat.sol`
4. Go on the relevant explorer (E.g.: cronoscan.com)
5. Confirm your contract as a single solidity file, and use the ABI code from build, after encoding it with https://abi.hashex.org/.










## Deploy Other Contracts (Echoer, ProxyLight, Multicall)

1. `cp .env.example .env`
2. Edit `.env` parameters
3. `npx truffle migrate --network $NETWORK --reset --f 104 --to 106`
