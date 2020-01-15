const express = require(`express`);
const router = express.Router();
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 2.4.1 first time enter user stroke info
 */
router.post(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let user = { ...req.user };
        let result = await query(con, `select * from user where id = ?`, [user.id]);
        result = result[0];
        let height = result.height;
        let weight = result.weight;
        let bmi = Decimal((height / weight) / weight).toFixed(2);

        let data = buildDao(body, user, bmi);
        let insert = await query(con, `insert into user_stroke set ?`, [data]);
        res.json(rb.build({}, `stroke info saved`));
    } catch (err) {
        next(err);
    }
});

function buildDao(body, user, bmi) {
    let result = {
        user_id: user.id,
        is_hypertension: body.hypertension,
        is_heart_disease: body.is_heart_disease,
        ever_married: body.ever_married,
        work_type: body.work_type,
        residence_type: body.residence_type,
        avg_glucose_level: body.avg_glucose_level,
        bmi: bmi,
        smoking_status: body.smoking_status
    }
    return result;
}

module.exports = router;