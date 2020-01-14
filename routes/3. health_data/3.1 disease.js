const express = require(`express`);
const router = express.Router();
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 3.1.1 get all the diseases in db
 */
router.get(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let result = await query(con, `select * from disease`, [user.id]);
        res.json(rb.build(result, `retrieve disease info successfully`));
    } catch (err) {
        next(err);
    }
})

module.exports = router;