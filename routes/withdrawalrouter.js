const express = require("express")
const { requestWithdrawal, withdrawals, grantWithdrawal, fetchTotalPendingWithdrawal, fetchTotalSuccessWithdrawal, fetchTotalWithdrawal, fetchUserWithdrawalRecords, fetchUserDepositRecords, deleteWithdrawal } = require("../controller/withdrawcontroller")


const withrouter = express.Router()

withrouter.post("/withdrawal", requestWithdrawal)

withrouter.get("/withdrawals", withdrawals)

withrouter.put("/update/withdrawal", grantWithdrawal)

withrouter.get("/pending/withdrawal", fetchTotalPendingWithdrawal)

withrouter.get("/success/withdrawal", fetchTotalSuccessWithdrawal)

withrouter.get("/total/withdrawal", fetchTotalWithdrawal)

withrouter.get("/with/records/:mobile", fetchUserWithdrawalRecords)
withrouter.get("/wallet/records/:mobile", fetchUserDepositRecords)

withrouter.delete("/del/withdrawal", deleteWithdrawal)


module.exports = withrouter