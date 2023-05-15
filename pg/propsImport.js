require('dotenv').config();
const itemprops = require('../resources/itemProps/itemProps.json')

const client = require('./pgClient')

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');

  client.query(`CREATE TABLE IF NOT EXISTS PropertyLabels (
    pid VARCHAR(6) PRIMARY KEY,
    prop_label VARCHAR(150) NOT NULL,
    prop_type VARCHAR(25) NOT NULL
  );
  `)
  .then(() => console.log('PropertyLabels created'))
  .catch(err => console.error('Creation error', err.stack))

  const insertquery = `INSERT INTO PropertyLabels (pid, prop_label, prop_type) VALUES
  ${Object.keys(itemprops).map((key, ind) => {
    const label = itemprops[key]['label'].replace(/'/g, "''")
    const prop = itemprops[key]['type'].replace(/'/g, "''")
      if (ind+1 == Object.keys(itemprops).length) return `('${key}', '${label}', '${prop}');`
      else return `('${key}', '${label}', '${prop}')`
  })}
    `

  client.query(insertquery)
  .then(() => console.log("Data inserted into PropertyLabels"))
  .catch(err => console.error('Insertion error', err.stack))
  .then(() => {
    client.end()
      .then(() => console.log('Connection ended'))
      .catch(err => console.log('An error occurred while disconnecting from the database'))
  })
})
.catch(err => console.error('Connection error', err.stack));
