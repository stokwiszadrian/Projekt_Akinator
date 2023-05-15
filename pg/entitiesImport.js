require('dotenv').config();
const shell = require('shelljs')

const dockername = 'projectpg'
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

  if (shell.exec(`sudo docker cp ./${file} ${dockername}:/${file}`).code !== 0) {
    shell.echo('Error: Unable to copy files to docker container.');
    shell.exit(1);
  }

  console.log("Copied to docker")
  
  const copyQuery = `COPY PropertyEntityLabels FROM '/${file}' DELIMITER ',' CSV;`

  client.query(copyQuery)
  .then(() => console.log(`Data from ${file} copied to PropertyEntityLabels`))
  .catch(err => console.error('Insertion error', err.stack))


})
.catch(err => console.error('Connection error', err.stack))