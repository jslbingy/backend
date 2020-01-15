const express = require(`express`);
const router = express.Router();
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 2.3.1 first time enter user allergen info
 */
router.post(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let user = { ...req.user };
        for (let d in body.allergen) {
            let data = buildDao(d, user);
            let insert = await query(con, `insert into user_allergen set ?`, [data]);
        }
        res.json(rb.build({}, `allergen info saved`));
    } catch (err) {
        next(err);
    }
});

function buildDao(d, user) {
    let result = {
        user_id: user.id,
        allergen_id: d.allergen_id
    }
    return result;
}

module.exports = router;