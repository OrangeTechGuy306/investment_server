const express = require("express")
const { getUser } = require("../controller/userController")
const { getUsersDeposit } = require("../controller/walletcontroller")
const { getAllProducts } = require("../controller/productController")
const router = express.Router()



router.get("/", (req, res)=>{
    res.render("index")
})

router.get("/login", (req, res)=>{
    res.render("login")
})

router.post("/login/data", getUser)

router.get("/", (req, res)=>{
    if(req.session.user){
        res.redirect("index")
        // req.session.destroy()
    }else{
        res.redirect("/login")
    }
})

// router.get("/wallet/:id",getUsersDeposit)

router.get("/signup", (req, res)=>{
    res.render("signup")
})


// DEPOSIT 
router.get("/deposit", (req, res)=>{
    res.render("deposit")
})

// WITHDRAWAL 
router.get("/withdraw", (req, res)=>{
    res.render("withdrawal")
})

// CUSTOMER 
router.get("/customer", (req, res)=>{
    res.render("customer")
})

// CUSTOMER 
router.get("/daily", (req, res)=>{
    res.render("checkin")
})

// PROFILE 
router.get("/profile", getUsersDeposit)

// PROFILE 
router.get("/product", (req, res)=>{
    res.render("product")
})

// TEAM 
router.get("/team", (req, res)=>{
    res.render("team")
})

router.get("/team", (req, res)=>{
    res.render("team")
})


// ADMINS PANEL
router.get("/altomaxx/login", (req, res)=>{
    res.render("altomaxxlogin")
})

router.get("/altomaxx/admin", (req, res)=>{
    res.render("altomaxxadmin")
})
router.get("/altomaxx/deposit", (req, res)=>{
    res.render("altomaxxdeposit")
})

router.get("/altomaxx/product", getAllProducts)

router.get("/altomaxx/users", (req, res)=>{
    res.render("altomaxxusers")
})

router.get("/altomaxx/withdrawal", (req, res)=>{
    res.render("altomaxxwithdrawal")
})




// ADMIN QUERY
// router.get("/get/product", getAllProducts)

module.exports = router