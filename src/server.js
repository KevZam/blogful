const knex = require("knex");
app = require("./app");

const { PORT, DB_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: DB_URL
});

// allows the app to access the knex instance defined here in the server.js, named db
app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// is app the express instance or the file?
// so express is what the node server is actually running on and the knex instance is the connection to the database?

// fix migrate:test script, manually changing database location with "test" in .env
