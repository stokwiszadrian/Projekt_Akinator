const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

const rowQuery = `SELECT table_name, count(*) AS column_count
    FROM information_schema."columns"
    WHERE table_schema = 'public' AND table_name = 'humans'
    GROUP BY table_name;
`

router.get('/', async (req, res) => {
    const humans = await client.query("SELECT qid, label FROM humans");
    if ( humans.rowCount == 0 ) return res.status(404).send("Not found")
    return res.send(humans.rows);
})

router.get('/byqid/:qid', async (req, res) => {
    const qid = req.params.qid
    const person = await client.query(`SELECT label FROM humans WHERE qid = '${qid}'`)
    if ( person.rowCount == 0 ) return res.status(404).send("Not found")
    return res.send(person.rows[0])
})

router.get('/bylabel/:label', async (req, res) => {
    const label = req.params.label
    const humans = await client.query(`SELECT qid, label FROM humans WHERE LOWER(label) = '${label}'`)
    if ( humans.rowCount == 0 ) return res.status(404).send("Not found")
    res.send(humans.rows)
})

router.get('/img/:qid', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    const imgRequest = await fetch(
        `https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P18&entity=${req.params.qid}&format=json`, {
            method: 'GET',

        })
    const imgJson = await imgRequest.json()
    try {
        const imgPath = imgJson["claims"]["P18"][0]["mainsnak"]["datavalue"]["value"].replaceAll(" ", "_")
        return res.send(imgPath)
    } catch(err) {
        return res.status(404).send("Not found")
    }
})


module.exports = router;