require('dotenv').config();
const props = require('../resources/itemProps/itemProps.json')
const humanProps = require('../resources/itemProps/humanItemProps.json')
const shell = require('shelljs')

const StreamZip = require('node-stream-zip')

const fs = require('fs')
const file = 'humans.csv'
const dockername = 'postgres'

const client = require('./pgClient');
const { exit } = require('process');

const datatypes = {
  "WikibaseItem": "TEXT",
  "String": "TEXT",
  "Monolingualtext": "TEXT",
}


client
.connect()
.then(async () => {
  console.log('Connected to PostgreSQL');

  const createQuery = `CREATE TABLE IF NOT EXISTS Humans (
    qid VARCHAR(12) PRIMARY KEY,
    label VARCHAR(300) NOT NULL,
    ${humanProps.map((key, ind) => {
      const datatype = datatypes[props[key]['type']]
      if (props[key]['type'] == "WikibaseItem") {
        if (ind+1 == Object.keys(props).length) return `${key} ${datatype}`
        else return `${key} ${datatype}`
      } else {
        if (ind+1 == Object.keys(props).length) return `${key} ${datatype}`
        else return `${key} ${datatype}`
      }
    })}
  );
  `

  await client.query(createQuery)
  .then(() => console.log('Humans table created'))
  .catch(err => console.error('Creation error', err.stack))

  if (shell.exec(`docker cp ./humans.csv ${dockername}:/humans.csv`).code !== 0) {
    shell.echo('Error: Unable to copy files to docker container.');
    shell.exit(1);
  }

  console.log("Copied to docker")

  const copyQuery = `COPY Humans FROM '/${file}' DELIMITER ';' quote E'\b' CSV;`

  client.query(copyQuery)
  .then(() => {
    console.log(`Data from ${file} copied to Humans`)
    shell.rm('-rf', 'humans.csv')
    exit(0)
  })
  .catch(err => {
    console.error('Insertion error', err.stack)
    exit(1)
  })

})
.catch(err => {
  console.error('Connection error', err.stack)
  exit(1)
})
