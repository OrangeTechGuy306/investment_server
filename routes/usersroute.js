const express = require("express")
const { addUser, getUser, getAllUsers, totalUsers, totalReferrals, searchUser, referral, myReferrals, referralBonus, getReferrals } = require("../controller/userController")
const { getUsersDeposit } = require("../controller/walletcontroller")

const usersrouter = express.Router()

usersrouter.post("/add/user", addUser)
usersrouter.post("/get/user", getUser)
usersrouter.get("/users", getAllUsers)
usersrouter.get("/user/wallet/:mobile", getUsersDeposit)
usersrouter.get("/search/user/:search", searchUser)
usersrouter.get("/referrals/:id", totalReferrals)
usersrouter.get("/refer/:referral", referral)
usersrouter.get("/ref/:ref", getReferrals)


// ADMIN
usersrouter.get("/total/users", totalUsers)

module.exports = usersrouter