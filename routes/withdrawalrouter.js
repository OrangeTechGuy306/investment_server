const express = require("express")
const { requestWithdrawal, withdrawals, grantWithdrawal, fetchTotalPendingWithdrawal, fetchTotalSuccessWithdrawal, fetchTotalWithdrawal, fetchUserWithdrawalRecords, fetchUserDepositRecords } = require("../controller/withdrawcontroller")


const withrouter = express.Router()

withrouter.post("/withdrawal", requestWithdrawal)

withrouter.get("/withdrawals", withdrawals)

withrouter.post("/update/withdrawal", grantWithdrawal)

withrouter.get("/pending/withdrawal", fetchTotalPendingWithdrawal)

withrouter.get("/success/withdrawal", fetchTotalSuccessWithdrawal)

withrouter.get("/total/withdrawal", fetchTotalWithdrawal)

withrouter.get("/with/records/:mobile", fetchUserWithdrawalRecords)
withrouter.get("/wallet/records/:mobile", fetchUserDepositRecords)


module.exports = withrouter