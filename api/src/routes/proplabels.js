const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const entities = await client.query("SELECT * FROM propertylabels");
    return res.send(entities.rows);
})

router.get('/bylabel/:label', async (req, res) => {
    const label = req.params.label.cas
    const entities = await client.query(`SELECT * FROM propertylabels WHERE LOWER(prop_label) = '${label}'`)
    res.send(entities.rows)
})

router.get('/bypid/:pid', async (req, res) => {
    const pid = req.params.pid
    const entities = await client.query(`SELECT prop_label FROM propertylabels WHERE pid = '${pid}'`)
    res.send(entities.rows[0])
})

router.get('/bytype/:type', async (req, res) => {
    const type = req.params.type
    const entities = await client.query(`SELECT * FROM propertylabels WHERE prop_type = '${type}'`)
    res.send(entities.rows)
})


module.exports = router;