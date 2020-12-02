const dotenv = require('dotenv');
const fs = require('fs');
const envText = fs.readFileSync('./.env.local').toString();
const parsed = dotenv.parse(envText);

process.env = {
  ...process.env,
  ...parsed,
};
