const { addAdmin, getAdmin, getAllAdmins, deleteAdmin, totalAdmins, issue } = require("../controller/admin");
const express = require("express")


const adminRouter = express.Router()



adminRouter.post("/add/admin", addAdmin)
adminRouter.post("/get/admin", getAdmin)
adminRouter.get("/admins", getAllAdmins)
adminRouter.post("/submit/issue", issue)
adminRouter.get("/total/admins", totalAdmins)
adminRouter.get("/delete/admin/:id", deleteAdmin)


module.exports = adminRouter