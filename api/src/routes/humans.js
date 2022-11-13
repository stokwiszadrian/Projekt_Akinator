const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});
const isValidDate = require('../utils/isValidDate')

const rowQuery = `SELECT table_name, count(*) AS column_count
    FROM information_schema."columns"
    WHERE table_schema = 'public' AND table_name = 'humans'
    GROUP BY table_name;
`

function condBuilder(len, ind, type, acc, cur) {
    if (ind + 1 == len) {
        switch (type) {
            case 'wikibase-item':
                return acc + `${cur} LIKE ${s} AND`
        }
    } else {
        switch (type) {
            case 'wikibase-item':
                return acc + `${cur} LIKE ${s}`
        }
    }
}

router.get('/', async (req, res) => {
    const humans = await client.query("SELECT qid, label FROM humans");
    return res.send(humans.rows);
})

router.post('/', async (req, res) => {
    const custom = await client.query("SELECT qid FROM humans WHERE qid LIKE 'Q%'")
    const nums = custom.rows.map((value, ind) => parseInt(value.qid.slice(1))).sort((a, b) => a - b)

    return res.send(nums);
})

router.post('/filter', async (req, res) => {
    let msg = ""
    const conditional = Object.keys(req.body).map((key) => {
        const type = req.body[key][0].type
        let s = req.body[key].reduce((substring, item) => {
            switch (type) {
                case 'WikibaseItem':
                    return substring + `%${item.value}`
                    
                case 'Time':
                    const char = item.value[0]
                    if (char == "<" || char == ">" || char == "=") {
                        const date = item.value.slice(1)
                        if ( isValidDate(date) ) {
                            return substring + char + `'${date}'`
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
            }
            
        }, "")
   
        switch(type) {
            case "Time":
                return `${key} ${s}`
            case "WikibaseItem":
                return `${key} LIKE '${s}'`
        }
    
        

    }).join(" AND ")

    if (msg !== "") {
        res.send({
            error: msg
        })
    }
    else {
        res.send(conditional)
    }

    // const filter = await client.query(`SELECT qid, label FROM humans WHERE ${conditional}`)

    // res.send(filter.rows)
})

module.exports = router;