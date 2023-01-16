const express = require("express");
const client = require('../config/psqlClient');
const router = express.Router({mergeParams: true});

router.get('/', async (req, res) => {
    const entities = await client.query("SELECT qid, label FROM propertyentitylabels");
    return res.send(entities.rows);
})

router.get('/bylabel/:label', async (req, res) => {
    const label = req.params.label.cas
    const entities = await client.query(`SELECT qid, label FROM propertyentitylabels WHERE LOWER(label) = '${label}'`)
    res.send(entities.rows)
})

router.get('/byqid/:qid', async (req, res) => {
    const qid = req.params.qid
    const entities = await client.query(`SELECT label FROM propertyentitylabels WHERE qid = '${qid}'`)
    res.send(entities.rows[0])
})


module.exports = router;