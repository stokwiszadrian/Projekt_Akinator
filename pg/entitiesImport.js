require('dotenv').config();
const fs = require('fs')
const files = fs.readdirSync('../resources/propValues/')

const { Client } = require('pg');
const client = new Client({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "tajne",
    database: 'akinatordb',
    port: '5432'
});

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS PropertyEntityLabels (
    qid VARCHAR(12) PRIMARY KEY,
    label VARCHAR(300) NOT NULL
  );
  `)
  .then(() => console.log('PropertyEntityValues created'))
  .catch(err => console.error('Creation error', err.stack))

  files.forEach((file) => {

    const values = require(`../resources/propValues/${file}`)

    const insertquery = `INSERT INTO PropertyEntityLabels (qid, label) VALUES
    ${values.map((item, ind) => {
      const value = item['label'].replace(/'/g, "''")
        if (ind+1 == values.length) return `('${item['id']}', '${value}');`
        else return `('${item['id']}', '${value}')`
    })}
      `
  
    client.query(insertquery)
    .then(() => console.log(`Data from ${file} inserted into PropertyEntityLabels`))
    .catch(err => console.error('Insertion error', err.stack))

  })

})
.catch(err => console.error('Connection error', err.stack))