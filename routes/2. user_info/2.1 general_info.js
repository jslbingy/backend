const express = require(`express`);
const router = express.Router();
const moment = require(`moment`);
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)

/**
 * API 2.1.1 first time enter user personal info
 */
router.post(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let user = { ...req.user };
        let birth_year = moment(body.dob).format('YYYY');
        let current_year = moment().year();
        body.age = current_year - birth_year;
        delete body.dob;
        let update = await query(con, `update user set ? where id = ?`, [body, user.id]);
        res.json(rb.build({}, `user info saved`));
    } catch (err) {
        next(err);
    }
});

/**
 * API 2.1.2 update user personal info
 */
router.put(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let user = { ...req.user };
        let birth_year = moment(body.dob).format('YYYY');
        let current_year = moment().year();
        body.age = current_year - birth_year;
        delete body.dob;
        let update = await query(con, `update user set ? where id = ?`, [body, user.id]);
        res.json(rb.build({}, `user info updated`));
    } catch (err) {
        next(err);
    }
});

/**
 * API 2.1.3 get user personal info
 */
router.get(`/`, async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let user = { ...req.user };
        let result = await query(con, `select * from user where id = ?`, [user.id]);
        result = result[0];
        result.gender = result.gender ? 'male' : 'female';
        delete result.password;
        res.json(rb.build(result, `retrieve user info successfully`));
    } catch (err) {
        next(err);
    }
})

module.exports = router;