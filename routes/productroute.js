
const express = require("express")
const { addProduct, getAllProducts, deleteProduct, totalProducts, getSingleProduct, addToCart, getUserCart, totalUserCart, investmentGain, totalInvestmentGain, dailyIncome } = require("../controller/productController")


const productrouter = express.Router()



productrouter.post("/add/product", addProduct)
productrouter.post("/add/cart", addToCart)
productrouter.get("/products", getAllProducts)
productrouter.get("/product/:id", getSingleProduct)

productrouter.get("/cart/:id", getUserCart)

productrouter.get("/total/cart/:id", totalUserCart)

productrouter.get("/invests/:mobile", investmentGain)

productrouter.delete("/delete/product/:id", deleteProduct)

productrouter.get("/total/products", totalProducts)

productrouter.get("/total/profit/:mobile", totalInvestmentGain)
productrouter.get("/daily/income/:mobile", dailyIncome)

module.exports = productrouter