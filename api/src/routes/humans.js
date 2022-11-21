const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});
const conditionBuilder = require('../utils/conditionBuilder')

const rowQuery = `SELECT table_name, count(*) AS column_count
    FROM information_schema."columns"
    WHERE table_schema = 'public' AND table_name = 'humans'
    GROUP BY table_name;
`

router.get('/', async (req, res) => {
    const humans = await client.query("SELECT qid, label FROM humans");
    return res.send(humans.rows);
})

router.get('/bylabel/:label', async (req, res) => {
    const label = req.params.label
    const humans = await client.query(`SELECT qid, label FROM humans WHERE LOWER(label) = '${label}'`)
    res.send(humans.rows)
})

router.post('/new', async (req, res) => {
    const custom = await client.query("SELECT qid FROM humans WHERE qid LIKE 'C%'")
    const nums = custom.rows.map((value, ind) => parseInt(value.qid.slice(1))).sort((a, b) => a - b)
    const props = Object.keys(req.body).join(", ")
    const values = Object.values(req.body).join(", ")
    const insert = await client.query(`INSERT INTO humans (qid, label, ${props}) VALUES (${nums.at(-1) + 1}, ${values})`)
    return res.send(insert)
})


// Przykładowy json dla /filter

// {
//     "P106": [
//         {
//             "type": "WikibaseItem",
//             "value": "Q82955"
//         },
//         {
//             "type": "WikibaseItem",
//             "value":  "Q189290"
//         }
//     ],
//     "P569": [
//         {
//             "type": "Time",
//             "value": ">2000-01-01"
//         }
//     ]
// }

router.post('/filter', async (req, res) => {

    const cond = conditionBuilder(req.body)

    console.log("Cond:" + cond.conditional)

    if (cond.msg !== "") {
        res.send({
            error: cond.msg
        })
    }
    else {
        const filter = await client.query(`SELECT qid, label FROM humans WHERE ${cond.conditional}`)
        res.send(filter.rows)
    }
})

module.exports = router;