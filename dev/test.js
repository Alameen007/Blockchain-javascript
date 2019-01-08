const Blockchain = require('./blockchain')
 
const akcoin = new Blockchain()

const ak1 = {
    "chain": [
    {
    "index": 1,
    "timestamp": 1545237412256,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestamp": 1545237548762,
    "transactions": [],
    "nonce": 16441,
    "hash": "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestamp": 1545237657532,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "9b65343003ac11e99813f9dcc69b736f"
    },
    {
    "amount": "500",
    "sender": "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "c6c79e6003ac11e99813f9dcc69b736f"
    },
    {
    "amount": "100",
    'sender': "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "cb5b093003ac11e99813f9dcc69b736f"
    },
    {
    'amount': "300",
    "sender": "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "cfc6047003ac11e99813f9dcc69b736f"
    }
    ],
    "nonce": 230154,
    "hash": "00003436208c48b114bad882f5c2d8260e3d09589948bc282f9beea38a6020b6",
    "previousBlockHash": "00009b2ef664890dbcd795344f8145bac1710db47cea457183f41c9ca24c3285"
    },
    {
    "index": 4,
    "timestamp": 1545237772045,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "dc36d4f003ac11e99813f9dcc69b736f"
    },
    {
    "amount": "600",
    "sender": "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "10902b2003ad11e99813f9dcc69b736f"
    },
    {
    "amount": "700",
    "sender": "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "134a1b0003ad11e99813f9dcc69b736f"
    },
    {
    "amount": "800",
    "sender": "IUYSUDYFBNB3453",
    "recipient": "KJSDLFKJSDHKJF8UWEUIORU",
    "transactionId": "174ba61003ad11e99813f9dcc69b736f"
    }
    ],
    "nonce": 81348,
    "hash": "0000705819c5d65f8bd46dd016926ecdbe7b4e9196b49d9878c9b81b8f94d06d",
    "previousBlockHash": "00003436208c48b114bad882f5c2d8260e3d09589948bc282f9beea38a6020b6"
    },
    {
    "index": 5,
    "timestamp": 1545237774080,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "2078210003ad11e99813f9dcc69b736f"
    }
    ],
    "nonce": 6350,
    "hash": "0000214d155b3358f80082dd21f424bebadc6294f91fd919227eace8957c710f",
    "previousBlockHash": "0000705819c5d65f8bd46dd016926ecdbe7b4e9196b49d9878c9b81b8f94d06d"
    },
    {
    "index": 6,
    "timestamp": 1545237777086,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "21aea53003ad11e99813f9dcc69b736f"
    }
    ],
    "nonce": 36,
    "hash": "0000704d7b20bbb476c282c4afede68e88843294ab571b56ff009606e5c13e36",
    "previousBlockHash": "0000214d155b3358f80082dd21f424bebadc6294f91fd919227eace8957c710f"
    },
    {
    "index": 7,
    "timestamp": 1545237781267,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "23792c0003ad11e99813f9dcc69b736f"
    }
    ],
    "nonce": 31309,
    "hash": "00006c993196a3ca1976e5901ee257dbfa8e1b6a016b39e3784ebd0d30375810",
    "previousBlockHash": "0000704d7b20bbb476c282c4afede68e88843294ab571b56ff009606e5c13e36"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "4a043a0003ac11e99813f9dcc69b736f",
    "transactionId": "25f6fd4003ad11e99813f9dcc69b736f"
    }
    ],
    "currentNodeUrl": "http://localhost:9001",
    "networkNodes": []
    }

    console.log('VALID', akcoin.chainIsValid(ak1.chain))
