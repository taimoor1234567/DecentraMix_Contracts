



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
4. Testnet: `npx truffle migrate --network testnet --reset --f 2 --to 3 &&  npx truffle migrate --network testnet --reset --f 6 --to 17 npx truffle migrate --network bsc --reset --f 6 --to 17 `
5. CRO: `npx truffle migrate --network cronos --reset --f 2 --to 3 &&  npx truffle migrate --network cronos --reset --f 22 --to 33 npx truffle migrate --network bsc --reset --f 6 --to 17 `
6. FTM: `npx truffle migrate --network fantom --reset --f 2 --to 3 &&  npx truffle migrate --network fantom --reset --f 40 —to 51 npx truffle migrate --network bsc --reset --f 6 --to 17 `
7. MATIC: `npx truffle migrate --network matic --reset --f 2 --to 3 &&  npx truffle migrate --network matic --reset --f 56 —to 67 npx truffle migrate --network bsc --reset --f 6 --to 17 `
8. AVAX: `npx truffle migrate --network avalanche --reset --f 2 --to 3 &&  npx truffle migrate --network avalanche --reset --f 72 —to 83 npx truffle migrate --network bsc --reset --f 6 --to 17 `
9. ETH: `npx truffle migrate --network mainnet --reset --f 2 --to 3 &&  npx truffle migrate --network mainnet --reset --f 88 —to 99 npx truffle migrate --network bsc --reset --f 6 --to 17 `









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
