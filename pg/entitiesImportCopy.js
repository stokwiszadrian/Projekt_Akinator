require('dotenv').config();
const fs = require('fs')
const files = fs.readdirSync('../resources/propValues/')

let qids = new Set()

files.forEach((file) => {
    const values = require(`../resources/propValues/${file}`)

    let insertquery = values.map((item, ind) => {
        const value = item['label'].replace(/,/g, " ")
        if (value != ''){
            if (!qids.has(item['id'])) {
                qids.add(item['id'])
                
                if ((value.split('"').length - 1) % 2 == 0) return `${item['id']},${value}\n`
                else return `${item['id']},${value}"\n`
            } else return ''
        } else return ''
    })

    let csv = insertquery.join('')

    fs.appendFile('./entities.csv', csv, () => {
        console.log(`appended from ${file}`)
    })

    insertquery = {}
    csv = ''
})

console.log("entities.csv created")
console.log(qids.size)
