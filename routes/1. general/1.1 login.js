const express = require(`express`);
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../resources/global").JWT_SECRET;
const passwordHash = require("password-hash");
const moment = require(`moment`);
const dbConfig = require(`../../dbConfig`);
const connection = require(`../../helpers/connection`);
const query = require(`../../helpers/query`);
const rb = require(`../../helpers/response_builder`)
/**
 * API 1.1.1 Login
 */
router.post("/login", async function (req, res, next) {
    let con;
    try {
        con = await connection(dbConfig);
        let body = { ...req.body };
        let result = await query(con, `select * from user where isAvailable and username = ?`, [body.username]);
        if (result.length !== 0) {
            result = result[0];
            if (!passwordHash.verify(body.password, result.password)) {
                let error = new Error(`Invalid username or password.`);
                error.status = 402;
                throw error;
            }
            let return_data = {};
            return_data.id = result.id;
            return_data.username = result.username;
            let token = jwt.sign({
                exp: moment().add(12, "hour").unix(),
                data: JSON.parse(JSON.stringify(return_data))
            }, JWT_SECRET);
            return_data.token = token;
            res.json(rb.build(return_data, `Login Success`));
        } else {
            let error = new Error(`This user does not exist.`);
            error.status = 401;
            throw error;
        }
    } catch (err) {
        next(err);
    }
});

/**
 * API 1.1.2 register
 */
router.post(`/register`, async function (req, res, next) {
    let con;
    try {
        let body = { ...req.body };
        let hashed_password = passwordHash.generate(body.password);
        con = await connection(dbConfig);
        let result = await query(con, `select * from user where isAvailable and username = ?`, [body.username]);
        result = result[0];
        if (result) {
            let error = new Error(`This user name is already taken by another user.`);
            error.status = 406;
            throw error;
        }
        let insert = await query(con, `insert into user set username = ?, password = ?`, [body.username, hashed_password]);
        let return_data = {};
        return_data.id = insert.insertId;
        return_data.username = body.username;
        let token = jwt.sign({
            exp: moment().add(12, "hour").unix(),
            data: JSON.parse(JSON.stringify(return_data))
        }, JWT_SECRET);
        return_data.token = token;
        res.json(rb.build({}, `new account registered`));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
