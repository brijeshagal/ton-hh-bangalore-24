const url = 'https://api.coingecko.com/api/v3/onchain/networks';
const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-TngpY4tbEXKr4mnHe5GXLFhQ'}
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));