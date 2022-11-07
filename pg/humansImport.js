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

  // console.log(createQuery)

  await client.query(createQuery)
  .then(() => console.log('Humans created'))
  .catch(err => console.error('Creation error', err.stack))

  const files = allFiles.slice(57)
    console.log(files)
  for (const file of files) {

    const allEntities = require(`../resources/humans/${file}`)

        // const claimList = humanProps.map((prop, ind) => {
        //   if (Object.keys(ent['claims']).includes(prop)) {
        //     const claimValues = ent['claims'][prop].map(value => {
        //       // console.log(value)
        //       switch(value['datatype']) {
        //         case 'monolingualtext':
        //           console.log(`'${value['datavalue']['text'].replace(/'/g, "''")}'`)
        //           return `'${value['datavalue']['text'].replace(/'/g, "''")}'`

        //         case 'wikibase-item':
        //           console.log(`${value['datavalue']['id']}`)
        //           return `${value['datavalue']['id']}`

        //         case 'string':
        //           console.log(`'${value['datavalue'].replace(/'/g, "''")}'`)
        //           return `${value['datavalue'].replace(/'/g, "''")}`

        //         case 'time':
        //           console.log(`'${value['datavalue']['time'].replace("+", "")}'`)
        //           return `${value['datavalue']['time'].replace("+", "")}`

        //         case 'quantity':
        //           console.log(`${value['datavalue']['amount'].replace("+", "")}`)
        //           return `${value['datavalue']['amount'].replace("+", "")}`
        //       }
        //     }).join(" | ")

        //     if (ent['claims'][prop]['datatype'] == 'quantity') return claimValues
        //     else return "'"+claimValues+"'"

        //   } else return `NULL`
        // })
        //   .join(', ')

        // console.log(claimList)

    const chunkSize = 1000;
    for (let i = 0; i < allEntities.length; i += chunkSize) {
        const entities = allEntities.slice(i, i + chunkSize);
        
        const insertquery = `INSERT INTO Humans VALUES
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
                    
                    // const date = new Date(datestring)
                    // if (isNaN(date.getDate())) {
                    //   const newString = datestring.slice(0, 4) + "-01-01T00:00:00Z"
                    //   // console.log(newString, datestring)
                    //   return `${newString}`
                    // }
                    // return `${datestring}`
    
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
        // console.log(insertquery)
        await client.query(insertquery)
        // .then(() => console.log(`Data inserted from ${file} into Humans ${i}`))
        // .catch(err => console.error('Insertion error', err.stack))
        console.log(console.log(`Data inserted from ${file} into Humans ${i}`))
    }
  }

})
.catch(err => console.error('Connection error', err.stack));