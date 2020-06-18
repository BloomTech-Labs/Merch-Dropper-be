module.exports = {
  development: {
    client: "pg",
    connection: { host : '127.0.0.1', database: 'merch-dropper', user: 'postgres', password: '244352' },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./databaseOperations/migrations",
    },
    seeds: {
      directory: "./databaseOperations/seeds",
    },
  },
  ////////////////////////////////////////////////////////

  testing: {
    client: "sqlite3",
    connection: {
      filename: "./databaseOperations/test.db3",
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./databaseOperations/migrations",
    },
    seeds: {
      directory: "./databaseOperations/seeds",
    },
  },
  ////////////////////////////////////////////////////////

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./databaseOperations/migrations",
    },
    seeds: {
      directory: "./databaseOperations/seeds",
    },
  },
};
