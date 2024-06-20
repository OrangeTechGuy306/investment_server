const pool = require("mysql")


module.exports.sql = pool.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"investment"
})


