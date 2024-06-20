
const express = require("express")
const cors = require("cors")
// const router = require("./server/routes/allroutes")
const usersrouter = require("./routes/usersroute")
const productrouter = require("./routes/productroute")
const walletRouter = require("./routes/walletroute")
const adminRouter = require("./routes/adminroute")
const withrouter = require("./routes/withdrawalrouter")



const app = express()
const port =  5000 //process.env.PORT || 5000
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())




app.use("/", usersrouter)
app.use("/", productrouter)
app.use("/", walletRouter)
app.use("/", adminRouter)
app.use("/", withrouter)




app.listen(port, ()=> console.log(port))