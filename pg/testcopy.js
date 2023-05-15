require('dotenv').config();
const fs = require('fs')
const files = fs.readdirSync('../resources/propValues/')
const path = require('path')
const client = require('./pgClient')
const file = 'testcsv.csv'

client
.connect()
.then(() => {
  console.log('Connected to PostgreSQL');
    console.log(file)
    const insertquery = `COPY test_copy FROM '/${file}' DELIMITER ',' CSV;`
  
    client.query(insertquery)
    .then(() => console.log(`Data from ${file} inserted into PropertyEntityLabels`))
    .catch(err => console.error('Insertion error', err.stack))



})
.catch(err => console.error('Connection error', err.stack))