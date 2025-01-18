const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // Point to your db.json
const middlewares = jsonServer.defaults();

// Use middlewares (logging, static file serving, etc.)
server.use(middlewares);

// Start the server on the environment's PORT (or default 8000)
const port =  8000;
server.use(router);

// Start the server
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});