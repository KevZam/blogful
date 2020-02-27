// We set up the postgrator config file to read the .env file and use this as the connection for the database
require("dotenv").config();

// we will need to install the pg driver since the postgrator will need access to it. Knex will need it as well.
module.exports = {
  migrationsDirectory: "migrations",
  driver: "pg",
  // set the connectionString to the test database when the NODE_ENV test script is run, otherwise use the regular dev db
  connectionString:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_DB_URL
      : process.env.DB_URL
};
