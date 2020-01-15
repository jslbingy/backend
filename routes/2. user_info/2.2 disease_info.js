const express = require(`express`);
const router = express.Router();
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 2.2.1 first time enter user disease info
 */
router.post(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let user = { ...req.user };
        for (let d in body.disease) {
            let data = buildDao(d, user);
            let insert = await query(con, `insert into user_disease set ?`, [data]);
        }
        res.json(rb.build({}, `disease info saved`));
    } catch (err) {
        next(err);
    }
});

function buildDao(d, user) {
    let result = {
        user_id: user.id,
        disease_id: d.disease_id
    }
    return result;
}

module.exports = router;