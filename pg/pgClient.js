const { Client } = require('pg');
const client = new Client({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    password: process.env.PGPASSWORD || 'tajne',
    database: process.env.PGDATABASE || 'projectdb',
    port: process.env.PGPORT || '5432'
});

module.exports = client