const mysql = require(`mysql`);
// const dbConfig = require(`../dbConfig`);
// const moment = require(`moment`);

module.exports = async params => new Promise(
    (resolve, reject) => {
        const connection = mysql.createConnection(params);
        connection.connect(error => {
            if (error) {
                reject(error);
                return;
            }
            resolve(connection);
        });
    });

// let connection = {
//     tran_conn: function () {
//         return new Promise(async (resolve, reject) => {
//             try {
//                 let con;
//                 // if (!db) {
//                 //     con = await this.connectToDb();
//                 // } else {
//                 //     con = await this.connectToDb(dbConfig);
//                 // }
//                 con = mysql.createConnection(dbConfig);

//                 con.beginTransaction((err) => {
//                     if (err) {
//                         err.status = 409;
//                         return reject(err);
//                     }
//                     return resolve(con);
//                 });
//             } catch (err) {
//                 reject(err);
//             }
//         })
//     },
//     commit: function (con) {
//         return new Promise(async (resolve, reject) => {
//             con.commit((err) => {
//                 try {
//                     con.release();
//                     if (err) {
//                         err.status = 409;
//                         reject(err);
//                     } else {
//                         resolve(null);
//                     }
//                 } catch (err) {
//                     reject(err);
//                 }
//             })
//         })
//     },
//     rollback: function (con) {
//         return new Promise((resolve, reject) => {
//             if (!con) {
//                 return resolve();
//             }
//             if (con.state != 'authenticated') {
//                 return resolve();
//             }
//             if (con._pool) {
//                 if (con._pool._freeConnections.indexOf(con) !== -1) {
//                     return resolve();
//                 }
//             }
//             con.rollback((err) => {
//                 try {
//                     con.release();
//                     if (err) {
//                         err.status = 409;
//                         reject(err);
//                     } else {
//                         resolve(null);
//                     }
//                 } catch (err) {
//                     reject(err);
//                 }
//             });
//         })
//     }
// };

// module.exports = connection;
