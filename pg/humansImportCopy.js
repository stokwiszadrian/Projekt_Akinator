require('dotenv').config();
const props = require('../resources/itemProps/itemProps.json')
const humanProps = require('../resources/itemProps/humanItemProps.json')
const StreamZip = require('node-stream-zip')
const zip = require('jszip')
const fs = require('fs')
const allFiles = fs.readdirSync('../resources/humans/')
const shell = require('shelljs')


const datatypes = {
  "WikibaseItem": "TEXT",
  "String": "TEXT",
  "Time": "DATE",
  "Monolingualtext": "TEXT",
  "Quantity": "NUMERIC(100, 5)"
}

const humanscopyfile =  () => {

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
  
  fs.writeFileSync('humansCreateTable.txt', createQuery)

  const files = allFiles
  // const files = allFiles
//   console.log(files)
  let i = 0
  for (const file of files) {

    let allEntities = JSON.parse(fs.readFileSync(`../resources/humans/${file}`))
    // const allEntities = require(`../resources/humans/${file}`)

    let entities = allEntities;
    
    let insertquery = entities.map((ent, ind) => {
        const label = ent.label.replace(";", "")
        if (label == '') return ''

        const claimList = humanProps.map((prop, ind) => {
        if (Object.keys(ent['claims']).includes(prop)) {
            const claimValues = ent['claims'][prop].map(value => {
            // console.log(value)
            switch(value['datatype']) {
                case 'monolingualtext':
                return `${value['datavalue']['text'].replace(/;/g, "")}`

                case 'wikibase-item':
                return `${value['datavalue']['id']}`

                case 'string':
                return `${value['datavalue'].replace(/;/g, "")}`

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
            else if (ent['claims'][prop][0]['datatype'] == 'time') return claimValues.split(" | ")[0]
            else return claimValues

        } else return ''
        })
        .join(';')
        if (claimList.split(";").length - 1 !== 845) {
            console.log(claimList.split(";").length - 1, ent['id'], label)
        }

        const finalString = `${ent['id']};${label.replace(/;/g, "")};${claimList}\n`

        if (finalString.split(";").length - 1 !== 847) {
            console.log(finalString.split(";").length - 1, ent['id'], label)
        }
        return finalString
    })
        .join('')
        

    console.log('insertquery created')

    console.log(`Data inserted from ${file} into Humans`)
    // console.log(insertquery)

    fs.appendFileSync(`./humans.csv`, insertquery)

    entities = null
    insertquery = null

    allEntities = null;
    i++
  }

  if (shell.exec(`zip -9 test.zip humans.csv`).code !== 0) {
    shell.echo('Error: Could not zip humans.csv file');
    shell.exit(1);
  }

}

humanscopyfile();