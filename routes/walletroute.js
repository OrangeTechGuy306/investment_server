
const express = require("express")
const { deposit, getUsersDeposit, allDeposit, deleteDeposit, getAllDeposit, checkin, fetchAllIssues, fetchSingleIssues, fetchUserDeposit, fetchUserWithdrawal } = require("../controller/walletcontroller")
const { userData } = require("../controller/userController")

const walletRouter = express.Router()


walletRouter.post("/deposit", deposit)
walletRouter.get("/user/wallet/:id", getUsersDeposit)
walletRouter.get("/user/total/:mobile", fetchUserDeposit)
walletRouter.get("/total/withdrawal/:mobile", fetchUserWithdrawal)
walletRouter.get("/wallet", allDeposit)
walletRouter.delete("/delete/wallet/:id", deleteDeposit)
walletRouter.get("/wallets", getAllDeposit)
walletRouter.post("/checkin/:id", checkin)
walletRouter.get("/issues", fetchAllIssues)
walletRouter.get("/issue/:mobile", fetchSingleIssues)

walletRouter.get("/user/history/:mobile", userData)


module.exports = walletRouter