const express = require(`express`);
const app = express();
const jwt = require(`jsonwebtoken`);
const JWT_SECRET = require("./resources/global").JWT_SECRET;
const moment = require(`moment`);
const port = 3000;
const server = require(`http`).Server(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let kickOutMap = new Map();
let userMap = new Map();
async function verifyToken(req, res, next) {
    req.token = req.headers[`authorization`] || ``;

    let kickOutTime = kickOutMap.get(req.token);
    if (kickOutTime) {
        let error = new Error(`You have been forced to logout by another person! ${kickOutTime}`);
        error.status = 401;
        kickOutMap.set(req.token, 0);
        return next(error);
    }
    jwt.verify(req.token, JWT_SECRET, function (err, decoded) {
        if (err) {
            err.status = 401;
            next(err);
        } else {
            req.user = decoded.data;
            let currentLogin = userMap.get(req.user.id);
            if (currentLogin) {
                if (currentLogin !== req.token) {
                    kickOutMap.set(currentLogin, moment().format(`DD/MM/YYYY HH:mm:ss`));
                }
            }
            userMap.set(req.user.id, req.token);
            next();
        }
    });
}

app.use("/general/account", require("./routes/1. general/1.1 login"));
app.use("/user_info/general", verifyToken, require("./routes/2. user_info/2.1 general_info"));
app.use("/user_info/disease", verifyToken, require("./routes/2. user_info/2.2 disease_info"));
app.use("/user_info/allergen", verifyToken, require("./routes/2. user_info/2.3 allergen_info"));
app.use("/user_info/stroke", verifyToken, require("./routes/2. user_info/2.4 stroke_info"));
app.use("/health_data/disease", require("./routes/3. health_data/3.1 disease"));
app.use("/health_data/allergen", require("./routes/3. health_data/3.2 allergen"));
app.use("/list", require("./routes/4. list/4.1 list"));


app.use(function (req, res, next) {
    console.log(`${req.method} -> ${req.originalUrl} is not a proper route!`);
    next(createError(404));
});

app.listen(port, () => console.log(`app is listening on port ${port}`));
