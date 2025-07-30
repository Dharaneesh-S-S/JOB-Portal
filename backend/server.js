const app = require('./app');
const http = require('http');
const { setupSocket } = require('./services/socket');

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Socket.io
setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});