// We set up the postgrator config file to read the .env file and use this as the connection for the database
require("dotenv").config();

// we will need to install the pg driver since the postgrator will need access to it. Knex will need it as well.
module.exports = {
  migrationsDirectory: "migrations",
  driver: "pg",
  connectionString: process.env.DB_URL
};
