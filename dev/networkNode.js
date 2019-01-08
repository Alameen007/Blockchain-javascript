const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Blockchain = require('./blockchain')
const uuid = require('uuid/v1')
const port = process.argv[2]
const rp = require('request-promise')

const nodeAddress = uuid().split('-').join('')

const akcoin = new Blockchain()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/blockchain', function(req, res) {
    res.send(akcoin)
})

app.post('/transaction', function(req, res) {
    const newTransaction = req.body
    const blockIndex = akcoin.addTransactionToPendingTransactions(newTransaction)
    res.json({ note: `Transaction will be added in block ${blockIndex}`})
})

app.post('/transaction/broadcast', function(req, res) {
  const newTransaction = akcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient)
    akcoin.addTransactionToPendingTransactions(newTransaction)
     
    const requestPromises = []
    akcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })
     
    Promise.all(requestPromises)
    .then(data => {
        res.json({ note: 'Transaction created and broadcast successfully.'})
    })
})

app.get('/mine', function(req, res) {
    const lastBlock = akcoin.getLastBlock()
    const previousBlockHash = lastBlock['hash']
    const currentBlockData = {
        transaction: akcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    }
    const nonce = akcoin.proofOfWork(previousBlockHash, currentBlockData)
    const blockHash = akcoin. hashBlock(previousBlockHash, currentBlockData, nonce)

    const newBlock = akcoin.createNewBlock(nonce, previousBlockHash, blockHash)

    const requestPromises = []
    akcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/receive-new-block',
            method: 'POST',
            body: {newBlock},
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })
     
    Promise.all(requestPromises)
    .then(data => {
        const requestOptions = {
            uri: akcoin.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 12.5,
                sender: "00",
                recipient: nodeAddress
            },
            json: true
        }

        return rp(requestOptions)
    })
    .then(data => {
        res.json({
            note: "New block mined and broadcast successfully",
            block: newBlock
        })
    }) 
}) 

app.post('/receive-new-block', function(req, res) {
    const newBlock = req.body.newBlock
    const lastBlock = akcoin.getLastBlock()
    const correctHash = lastBlock.hash === newBlock.previousBlockHash
    const correctIndex = lastBlock['index'] + 1 === newBlock['index']

    if (correctHash && correctIndex) {
        akcoin.chain.push(newBlock)
        akcoin.pendingTransactions = []
        res.json({
            note: 'New block received and accepted.',
            newBlock
        })
    } else {
        res.json({
            note: 'New block rejected.',
            newBlock
        })
    }
})

app.post('/register-and-broadcast-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl
    if (akcoin.networkNodes.indexOf(newNodeUrl)  == -1) {
        akcoin.networkNodes.push(newNodeUrl)
    }

    const regNodesPromises = []
    akcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/register-node',
            method: 'POST',
            body: {newNodeUrl: newNodeUrl},
            json: true
        }

        regNodesPromises.push(rp(requestOptions))
    })

    Promise.all(regNodesPromises).then(data => {
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-nodes-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [
                    ...akcoin.networkNodes, 
                    akcoin.currentNodeUrl
                ]
            },
            json: true
        }  

        return rp(bulkRegisterOptions)
    }).then(data => {
        res.json({note: 'New node registered with network successfully.'})
    })
})

app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl
    const nodeNotAlreadyPresent = akcoin.networkNodes.indexOf(newNodeUrl) == -1
    const notCurrentNode = akcoin.currentNodeUrl !== newNodeUrl
    if (nodeNotAlreadyPresent && notCurrentNode) akcoin.networkNodes.push(newNodeUrl)
    res.json({ note: 'New node registered successfully.'})
})

app.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent = akcoin.networkNodes.indexOf(networkNodeUrl) == -1
        const notCurrentNode = akcoin.currentNodeUrl !== networkNodeUrl
        if (nodeNotAlreadyPresent && notCurrentNode) {
            akcoin.networkNodes.push(networkNodeUrl)
        }
    })

    res.json({
        note: 'Bulk registration successful.'
    })
})
 
app.get('/consensus', function(req, res) {
    const requestPromises = []
    akcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/blockchain',
            method: 'GET',
            json: true
        }

        requestPromises.push(rp(requestOptions))
    })

    Promise.all(requestPromises)
    .then(blockchains => {
       const currentChainLength = akcoin.chain.length
       let maxChainLength = currentChainLength
       let newLongestChain = null
       let newPendingTransactions = null
       
       blockchains.forEach(blockchain => {
           if(blockchain.chain.length > maxChainLength) {
               maxChainLength = blockchain.chain.length
               newLongestChain = blockchain.chain
               newPendingTransactions = blockchain.pendingTransactions
           }
       })

       if (!newLongestChain || (newLongestChain && !akcoin.chainIsValid(newLongestChain))) {
           res.json({
               note: 'Current chain has not been replaced',
               chain: akcoin.chain
           })
       } else {
           akcoin.chain = newLongestChain
           akcoin.pendingTransactions = newPendingTransactions
           res.json({
               note: 'This chain has been replaced.',
               chain: akcoin.chain
           })
       }
        
    })
})

app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash
    const correctBlock = akcoin.getBlock(blockHash)
    res.json({
        block: correctBlock
    })
})

app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId
    const transactionData = akcoin.getTransaction(transactionId)
    res.json({
        transaction: transactionData.transaction,
        block: transactionData.block
    })
})

app.get('/address/:address', function(req, res) {
    const address = req.params.address
    const addressData = akcoin.getAddressData(address)
    res.json({
        addressData
    })
})
 

app.listen(port, function() {
    console.log(`Listening on port ${port}...`)
})