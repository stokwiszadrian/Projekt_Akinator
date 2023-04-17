const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const entities = await client.query("SELECT * FROM propertylabels");
    if (entities.rowCount == 0) res.status(404).send("Not found")
    return res.send(entities.rows);
})

router.get('/bylabel/:label', async (req, res) => {
    const label = req.params.label.cas
    const entities = await client.query(`SELECT * FROM propertylabels WHERE LOWER(prop_label) = '${label}'`)
    if (entities.rowCount == 0) res.status(404).send("Not found")
    res.send(entities.rows)
})

router.get('/bypid/:pid', async (req, res) => {
    const pid = req.params.pid
    const entities = await client.query(`SELECT prop_label, question FROM propertylabels WHERE pid = '${pid}'`)
    if (entities.rowCount == 0) res.status(404).send("Not found")
    res.send(entities.rows[0])
})

router.get('/bytype/:type', async (req, res) => {
    const type = req.params.type
    const entities = await client.query(`SELECT * FROM propertylabels WHERE prop_type = '${type}'`)
    if (entities.rowCount == 0) res.status(404).send("Not found")
    res.send(entities.rows)
})


module.exports = router;