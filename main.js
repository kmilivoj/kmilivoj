import fetch from "node-fetch";
const Url = "http://localhost:8081/";
const networkId ='testnet';
const address_type = 'Enterprise';
const publicKey = 'abada9abc2068d927fe59681b522d7b87536bf35200c9c8bdca007ab5b056ddf'
const accountBalanceUrl = 'account/balance';
const networkStatusUrl = 'network/status';
const senderAddr = 'addr_test1vp656w32sldxx9ycgwtyuc6c0g4ju0c28t5euuq5jtf4amgg7wlem'

const networkStatusBody = {
  network_identifier: {
    blockchain: "cardano",
    network: "testnet",
  },

  metadata: {},
};

const accountBalanceBody = {
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    "account_identifier": {
        // "address": "addr_test1vp656w32sldxx9ycgwtyuc6c0g4ju0c28t5euuq5jtf4amgg7wlem",
        "address": `${senderAddr}`,
        "metadata": {}
    },
    "block_identifier": {
        "index": 0,
        "hash": ""
    }
};

let url = Url + networkStatusUrl;
console.log(url);
let reqBody = networkStatusBody;

const getData = await fetch(url, {
  method: "POST",
  body: JSON.stringify(reqBody),
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((json) => {
    console.log(json);
    console.log('current block id: ', json.current_block_identifier.index);
    return  json.current_block_identifier.index;
  });

  var block_id = parseInt(getData);
  
  console.log(block_id);

////////////////////////////////////////////////////
getBalance(block_id);

async function getBalance(block_id) {
  console.log(block_id);
  url = Url + accountBalanceUrl;
  console.log(url);
  reqBody = accountBalanceBody;
  reqBody.block_identifier.index = block_id;

  fetch(url, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) => {   
      console.log(json);
      console.log();
      console.log('Account balance: '+ parseInt(json.balances[0].value)/1000000, json.balances[0].currency.symbol); 
    });
}


const networkOptionsUrl = 'network/options';
const networkOptionsBody = {
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    "metadata": {}
};

const networkListUrl = 'network/list';
const networkListBody = 
{
    "metadata": {}
};

const accountCoinsUrl = 'account/coins';
const accountCoinsBody = 
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": "testnet"
    },
    
    "account_identifier": {
        "address": `${senderAddr}`
        },
        "metadata": {},

    "include_mempool": true,
    "currencies": [
        {
            "symbol": "ADA",
            "decimals": 6,
            "metadata": {}
        }
    ]
}
console.log('coins Body: ',accountCoinsBody);



const accountDeriveUrl = 'construction/derive';
const accountDeriveBody =
{
    "network_identifier": {
        "blockchain": "cardano",
        "network": `${networkId}`
    },
    "public_key": {
        "hex_bytes": `${publicKey}`,
        "curve_type": "edwards25519"
    },
    "metadata": {
        "relative_ttl": 1000,
        "address_type": `${address_type}`
    }
}



url = Url + accountDeriveUrl;
console.log(url);
reqBody = accountDeriveBody;
const deriveAddr = await fetch(url, {
  method: "POST",
  body: JSON.stringify(reqBody),
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((json) => {
    //console.log(json);
    console.log('Address derived from public key: ', json.account_identifier.address);
    //return  json.account_identifier.address;
  });