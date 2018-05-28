let {Block, Blockchain, Transaction} = require('../src/blockchain');

const blockchain = new Blockchain();

console.log("\nStarting the miner...\n");
blockchain.minePendingTransactions('deadbeef0');
blockchain.minePendingTransactions('deadbeef1');
blockchain.minePendingTransactions('deadbeef1');
blockchain.minePendingTransactions('deadbeef1');
blockchain.minePendingTransactions('deadbeef0');

blockchain.createTransaction(new Transaction('deadbeef0', 'deadbeef1', 200));

console.log("\nBalance of deadbeef0: ", blockchain.getBalanceOf('deadbeef0'));
console.log("Balance of deadbeef1: ", blockchain.getBalanceOf('deadbeef1'));

// console.log("\n\n -- Blockchain -- \n",blockchain);