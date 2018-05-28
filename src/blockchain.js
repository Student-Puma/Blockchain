const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(transactions) {
        this.index = 0;
        this.timestamp = new Date();
        this.transactions = transactions;

        this.previousHash = "0";
        this.hash = this.calculateHash();

        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(
            this.nonce +
            this.index +
            this.timestamp +
            this.previousHash +
            JSON.stringify(this.data)
        ).toString();
    }

    mine(difficulty) {
        let checks;
        do {
            checks = 2;

            this.nonce++;
            this.hash = this.calculateHash();

            if(this.hash.substr(0, difficulty) !== Array(difficulty + 1).join("0"))
                continue;
            else checks--;

            let suma = 0;
            for(let digit of this.hash) {
                suma = isNaN(digit) ? suma + 1 : suma - 1;
            }

            if(suma < 0) continue;
            else checks--;
        } while(checks !== 0);

        console.log("Block mined: " + this.hash)
    }

    isValid() {
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 3;
        this.createGenesis();

        this.miningReward = 100;
        this.pendingTransactions = [];
    }

    createGenesis() {
        this.chain.push(new Block('Rabbit Coin: Genesis'));
    }

    last() {
        return this.chain[this.chain.length - 1];
    }

    // ---> Old add block method <---
    // add(block) {
    //     block.index = this.chain.length;
    //     block.previousHash = this.last().hash;
    //     block.mine(this.difficulty);
    //     this.chain.push(block);
    // }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(this.pendingTransactions);
        block.mine(this.difficulty);
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOf(address) {
        let balance = 0;
        for(const block of this.chain) {
            for(const transaction of block.transactions) {
                if(transaction.fromAddress == address)
                    balance -= transaction.amount;
                else if(transaction.toAddress == address)
                    balance += transaction.amount;
            }
        }

        for(const transaction of this.pendingTransactions) {
            if(transaction.fromAddress == address)
                balance -= transaction.amount;
            else if(transaction.toAddress == address)
                balance += transaction.amount;
        }

        

        return balance;
    }

    check() {
        for(let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i-1];

            if(current.hash !== current.calculateHash())
                return false;
            if(current.previousHash !== previous.hash)
                return false;
        }
        return true;
    }
}

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.amount = amount;
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
    }
}

module.exports = {
    Block: Block,
    Blockchain: Blockchain,
    Transaction: Transaction
}