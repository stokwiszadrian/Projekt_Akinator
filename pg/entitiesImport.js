require('dotenv').config();

const file = 'entities.csv'

const client = require('./pgClient')

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS PropertyEntityLabels (
    qid VARCHAR(12) PRIMARY KEY,
    label TEXT NOT NULL
  );
  `)
  .then(() => console.log('PropertyEntityLabels created'))
  .catch(err => console.error('Creation error', err.stack))

  
  const copyQuery = `COPY PropertyEntityLabels FROM '/${file}' DELIMITER ',' CSV;`

  client.query(copyQuery)
  .then(() => console.log(`Data from ${file} copied to PropertyEntityLabels`))
  .catch(err => console.error('Insertion error', err.stack))


})
.catch(err => console.error('Connection error', err.stack))