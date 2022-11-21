const isValidDate = require('../utils/isValidDate')

function conditionBuilder(json) {
    let msg = ""
    const conditional = Object.keys(json).map((key) => {

        const type = json[key][0].type
        const len = json[key].length

        let s = json[key].reduce((substring, item, index) => {

            const char = item.value[0]
            switch (type) {
                case 'Time':
                    if (char == "<" || char == ">" || char == "=") {
                        const date = item.value.slice(1)
                        if ( isValidDate(date) ) {
                            if (index+1 == len) {
                                return substring + `${key} ${char}'${date}'`
                            }
                            else {
                                return substring + `${key} ${char}'${date}' AND `
                            }
                        }
                        else {
                            msg += `Invalid date format at ${key}`
                            return substring
                        }
                    }
                    else {
                        msg += `Datestring must contain a comparator('<', '>', '=') at the beggining`
                        return substring
                    }

                case 'Quantity':
                    if (char == "<" || char == ">" || char == "=") {
                        if (index+1 == len) {
                            return substring + `${key} ${item.value}`
                        }
                        else {
                            return substring + `${key} ${item.value} AND `
                        }
                    }
                    else {
                        msg += `Datestring must contain a comparator('<', '>', '=') at the beggining`
                        return substring
                    }

                default:
                    return substring + `%${item.value}`
            }
            
        }, "")
   
        switch(type) {
            case "Time":
                return `${s}`
            case "Quantity":
                return `${s}`
            default:
                return `${key} LIKE '${s}%'`
        }
    
        

    }).join(" AND ")

    return {
        msg: msg,
        conditional: conditional
    }
}

module.exports = conditionBuilder