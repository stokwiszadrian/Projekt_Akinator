require('dotenv').config();
const fs = require('fs')
const files = fs.readdirSync('../resources/propValues/')

const client = require('./pgClient')

// client
// .connect()
// .then(() => {
//   console.log('Connected to PostgreSQL');

//   client.query(`CREATE TABLE IF NOT EXISTS PropertyEntityLabels (
//     qid VARCHAR(12) PRIMARY KEY,
//     label VARCHAR(300) NOT NULL
//   );
//   `)
//   .then(() => console.log('PropertyEntityValues created'))
//   .catch(err => console.error('Creation error', err.stack))
let qids = new Set()

files.forEach((file) => {

    const values = require(`../resources/propValues/${file}`)

    // console.log(values)
    console.log(`""`.split('"'))
    let insertquery = values.map((item, ind) => {
        const value = item['label'].replace(/,/g, " ")
        if (value != ''){
            if (!qids.has(item['id'])) {
                qids.add(item['id'])
                
                // console.log(`Added ${item['id']}`)
                if ((value.split('"').length - 1) % 2 == 0) return `${item['id']},${value}\n`
                else return `${item['id']},${value}"\n`
            } else return ''
        } else return ''
    })

    let csv = insertquery.join('')

    // console.log(csv)
    fs.appendFile('./entities.csv', csv, () => {
        console.log(`appended from ${file}`)
    })


    insertquery = {}
    csv = ''
    // client.query(insertquery)
    // .then(() => console.log(`Data from ${file} inserted into PropertyEntityLabels`))
    // .catch(err => console.error('Insertion error', err.stack))

})

console.log("entities.csv created")
console.log(qids.size)
