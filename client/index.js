const axios = require('axios');
const readline = require('readline');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

async function main() {
  const merkleTree = new MerkleTree(niceList);
  const root = merkleTree.getRoot();
  let name = '';
  const askForName = async () => {
    rl.question(`Enter ${name ? 'another' : 'a'} name: `, async (input) => {
      name = input || 'Norman Block';
      const index = niceList.findIndex((n) => n === name);
      const proof = merkleTree.getProof(index);

      const { data: gift } = await axios.post(`${serverUrl}/gift`, {
        name,
        proof,
        root,
      });

      console.log(`\n${name}, ${gift}\n`);
      askForName();
    });
  };
  askForName();
}

main();
