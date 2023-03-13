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

router.get('/byqid/:qid', async (req, res) => {
    const qid = req.params.qid
    const person = await client.query(`SELECT label FROM humans WHERE qid = '${qid}'`)
    return res.send(person.rows[0])
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

router.get('/img/:qid', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const imgRequest = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${req.params.qid}&format=json`, {
            method: 'GET',

        })
    const imgJson = await imgRequest.json()
    console.log(imgJson)
    try {
        const imgPath = imgJson["claims"]["P18"][0]["mainsnak"]["datavalue"]["value"].replaceAll(" ", "_")
        return res.send(imgPath)
    } catch(err) {
        return "Not found"
    }
})

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