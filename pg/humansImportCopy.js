require('dotenv').config();
const humanProps = require('../resources/itemProps/humanItemProps.json')
const fs = require('fs')
const allFiles = fs.readdirSync('../resources/humans/')

const humanscopyfile =  () => {

  const files = allFiles
  for (const file of files) {

    let entities = require(`../resources/humans/${file}`)
    
    let formattedData = entities.map((ent, ind) => {
        const label = ent.label.replace(";", "")
        if (label == '') return ''

        const claimList = humanProps.map((prop, ind) => {
        if (Object.keys(ent['claims']).includes(prop)) {
            const claimValues = ent['claims'][prop].map(value => {

            switch(value['datatype']) {
                case 'monolingualtext':
                return `${value['datavalue']['text'].replace(/;/g, "")}`

                case 'wikibase-item':
                return `${value['datavalue']['id']}`

                case 'string':
                return `${value['datavalue'].replace(/;/g, "")}`

            }
            }).join(" | ")
            
            return claimValues

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
        

    console.log(`Data copied from ${file} into humans.csv`)

    fs.appendFileSync(`./humans.csv`, formattedData)

    entities = null
    formattedData = null

  }

}

humanscopyfile();