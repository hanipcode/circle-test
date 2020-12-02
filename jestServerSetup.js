const { server } = require('./src/helpers/testServer');
require('whatwg-fetch');

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

module.exports = server;
