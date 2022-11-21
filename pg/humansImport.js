require('dotenv').config();
const props = require('../resources/itemProps/itemProps.json')
const humanProps = require('../resources/itemProps/humanItemProps.json')

const fs = require('fs')
const allFiles = fs.readdirSync('../resources/humans/')
// console.log(allFiles)

const { Client } = require('pg');
const client = new Client({
    user: process.env.PGUSER,
    host: 'localhost',
    password: process.env.PGPASSWORD,
    database: 'akinatordb',
    port: '5432'
});

const datatypes = {
  "WikibaseItem": "TEXT",
  "String": "TEXT",
  "Time": "DATE",
  "Monolingualtext": "TEXT",
  "Quantity": "NUMERIC(100, 5)"
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
  .then(() => console.log('Humans created'))
  .catch(err => console.error('Creation error', err.stack))

  let stream = fs.createWriteStream("insertHumansQuery.txt", {flags: 'a'})

  const chunkSize = 1000;

  const files = allFiles.slice(97)
  // const files = allFiles
  console.log(files)
  for (const file of files) {

    let allEntities = JSON.parse(fs.readFileSync(`../resources/humans/${file}`))
    // const allEntities = require(`../resources/humans/${file}`)

    for (let i = 0; i < allEntities.length; i += chunkSize) {
        let entities = allEntities.slice(i, i + chunkSize);
        
        let insertquery = `INSERT INTO Humans VALUES
        ${entities.map((ent, ind) => {
          const label = ent.label.replace(/'/g, "''")
    
          const claimList = humanProps.map((prop, ind) => {
            if (Object.keys(ent['claims']).includes(prop)) {
              const claimValues = ent['claims'][prop].map(value => {
                // console.log(value)
                switch(value['datatype']) {
                  case 'monolingualtext':
                    return `${value['datavalue']['text'].replace(/'/g, "''")}`
    
                  case 'wikibase-item':
                    return `${value['datavalue']['id']}`
    
                  case 'string':
                    return `${value['datavalue'].replace(/'/g, "''")}`
    
                  case 'time':
                    const datestring = value['datavalue']['time']
                    let date = new Date()
                      if (parseInt(datestring.slice(6, 8)) == 0) {
                        date.setYear(parseInt(datestring.slice(1, 5)))
                        date.setMonth(0)
                        date.setDate(1)
                      } else {
                        date.setYear(parseInt(datestring.slice(1, 5)))
                        date.setMonth(parseInt(datestring.slice(6, 8)))
                        date.setDate(parseInt(datestring.slice(10, 12)))
                      }
                      const options = {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }
                      // console.log(date.toLocaleDateString('en-US', options)+" BC")
                      if (datestring[0] == "-") {
                        if (date.getFullYear() > 4712) return `January 1, 4700 BC`
                        else return `${date.toLocaleDateString('en-US', options)} BC`
                      }
                      else return `${date.toLocaleDateString('en-US', options)}`
                    
    
                  case 'quantity':
                    return `${value['datavalue']['amount'].replace("+", "")}`
                }
              }).join(" | ")
              

              if (ent['claims'][prop][0]['datatype'] == 'quantity') return claimValues.split(" | ")[0]
              else if (ent['claims'][prop][0]['datatype'] == 'time') return "'"+claimValues.split(" | ")[0]+"'"
              else return "'"+claimValues+"'"
    
            } else return `NULL`
          })
            .join(', ')
            
          if (ind+1 == entities.length) return `('${ent['id']}', '${label}', ${claimList});`
            else return `('${ent['id']}', '${label}', ${claimList})`
        })}
          `
    
        console.log('insertquery created')
        // fs.appendFile('humansInsertQuery.txt', insertquery+"\n", (err) => {
        //   if (err) throw err;
        //   console.log(`Data inserted from ${file} into Humans ${i}`)
        // })
        // await client.query(insertquery)
        stream.write(insertquery+"\n")
        console.log(`Data inserted from ${file} into Humans ${i}`)

        entities = null
        insertquery = null
    }

    allEntities = null;

  }
  stream.end()

})
.catch(err => console.error('Connection error', err.stack));