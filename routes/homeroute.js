const express = require("express")
const homerouter = express.Router()

homerouter.get("/home", (req, res)=>{
    res.render("index")
})


module.exports = homerouter