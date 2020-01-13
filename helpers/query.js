module.exports = async (con, q, params) => new Promise(
    (resolve, reject) => {
        const handler = (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        };
        con.query(q, params, handler);
    });
