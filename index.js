const server = require("./api/server");

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`\n*** Server is runnning on http://localhost:${PORT} ***\n`);
});