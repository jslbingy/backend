const express = require(`express`);
const router = express.Router();
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 4.1.1 list of work_type
 */
router.get(`/work_type`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let result = await query(con, `select name from work_type order by name`);
        let work_type = [...result.name];
        res.json(rb.build(work_type, `work_type list retrieved`));
    } catch (err) {
        next(err);
    }
});


/**
 * API 4.1.2 list of residence_type
 */
router.get(`/residence_type`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let result = await query(con, `select name from residence_type order by name`);
        let residence_type = [...result.name];
        res.json(rb.build(residence_type, `residence_type list retrieved`));
    } catch (err) {
        next(err);
    }
});


/**
 * API 4.1.3 list of smokin_status
 */
router.get(`/smoking_status`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let result = await query(con, `select name from smoking_status order by id`);
        let smoking_status = [...result.name];
        res.json(rb.build(smoking_status, `smoking_status list retrieved`));
    } catch (err) {
        next(err);
    }
});

module.exports = router;