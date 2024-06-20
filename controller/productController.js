var cron = require('node-cron');

const { sql } = require("../sql");

// const cron = require('node-cron');

module.exports.addProduct = (req, res) => {


  const { name, price, income, rev, img } = req.body;

  try {
    if (
      name.trim() === "" ||
      price.trim() === "" ||
      income.trim() === "" ||
      rev.trim() === ""
    ) {
      res.send({ status: false, msg: "All Fields are required!" });
    } else {
      sql.getConnection((e, con) => {
        if (e) console.log(e);
        con.query(
          "SELECT * FROM products WHERE product_name = ?",
          [name],
          (er, product) => {

            if (er) console.log(er);

            if (product != "") {
              res.send({ status: false, msg: "product name already exist!" });
            } else {
              con.query(
                "INSERT INTO products(product_name, price, income, revenue, image) VALUES(?,?,?,?,?)",
                [name, price, income, rev, img],
                (err, suc) => {
                  if (err) console.log(err);

                  res.send({ status: true, msg: "product added successfully" });
                }
              );
            }
          }
        );
        con.release();
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getSingleProduct = (req, res) => {
  const { id } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);
      con.query(
        "SELECT * FROM products WHERE prod_id = ?",
        [id],
        (er, product) => {
          if (er) console.log(er);

          res.send({ status: false, msg: product });
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllProducts = (req, res) => {

  try {
    
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT * FROM products", (er, products) => {
        if (er) console.log(er);

        if (products != "") {
          // console.log(products)
          res.send({ status: true, msg: products });
        } else {
          res.json({ status: false, msg: "Empty Products" });
        }
      });
      con.release();
    });
    // res.render("altomaxxproduct")
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);
      con.query(
        "DELETE FROM products WHERE product_id = ?",
        [id],
        (er, product) => {
          if (er) console.log(er);

          res.send({ status: true, msg: "product deleted successfully" });
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.totalProducts = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT COUNT(*) AS total FROM products", (er, total) => {
        if (er) console.log(er);

        res.send({ status: true, msg: total });
        // console.log(total)
      });
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.addToCart = (req, res) => {


  const { mobile, price, name, income, image, rev, balance, ref } = req.body;

  try {

    if (
      (mobile.trim() === "" || price.trim() === "" || name.trim(),
      income.trim() === ""||
      image.trim() === ""||
      rev.trim() === "")
    ) {
      res.send({ status: false, msg: "Product Not valid" });
    } else {

        if(!balance){
            res.send({ status: false, msg: "Unauthorized Product" });
        }else if(parseInt(price) > parseInt(balance)){
            res.send({ status: false, msg: "Insufficient Fund" });
        }else{

            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT * FROM carts WHERE product_name = ? AND mobile = ?",[name, mobile],(err, data)=>{
                    if(err) console.log(err)

                    if(data != ""){
                        res.send({status:false, msg:"You already invest on this product"})
                    }else{
                       

                        con.query("INSERT INTO carts(mobile, product_name, price, image, revenue, income, profit) VALUES(?,?,?,?,?,?,?)", [mobile, name, price, image, rev, income, 0], (er, cart)=>{
                          
                          if(er) console.log(er)
                            
                            res.send({status:true, msg:"Investment Successful"})
                            // con.query("SELECT * FROM referrals WHERE referee = ?", [ref], (errr, refer)=>{

                            //   const lv
                            //   console.log({refer})
                            // })
                          
                      })
                    }
                })

                con.release()
            })
        }   
        
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getUserCart = (req, res) => {

  const { id } = req.params;
  

  try {

    sql.getConnection((e, con) => {

      if (e) console.log(e);

      con.query("SELECT * FROM carts WHERE mobile = ?", [id], (er, carts) => {

        if (er) console.log(er);

        if(carts != ""){
            res.send({ status: true, msg: carts });
        }else{
            res.send({ status: false, msg: "Empty Drone" });
        }


      });
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports.totalUserCart = (req, res) => {
  const { id } = req.params;
  // console.log(id)

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT COUNT(*) as total FROM carts WHERE mobile = ?",
        [id],
        (er, carts) => {
          if (er) console.log(er);

          console.log(carts);
          res.send({ status: true, msg: carts });
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

// INVESTMENT
module.exports.totalInvestmentGain = (req, res) => {

  const { mobile } = req.params;

  // setInterval()

  try {

    cron.schedule('* */24 * * *', () => {
    sql.getConnection((e, con) => {

        if(e) console.log(e)

          con.query("SELECT * FROM carts WHERE mobile = ?", [mobile], (er, invest)=>{
            
            if(er) console.log(er)
              
              const profit = invest
              
              if(profit !== null){
                
                  profit.map((p)=>{
    
                  const income = parseInt(p.profit) + parseInt(p.income)
                  con.query("UPDATE carts SET profit = ? WHERE mobile = ? AND income = ?",[income, mobile, p.income],(err, profitReturn)=>{

                    if(err) console.log(err)

                    console.log({income})
                    
                  })
            });

            
          }else{
            console.log("it is null")
          }
          
          
          })
        con.release()
      })
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports.investmentGain = (req, res) => {

  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      con.query(
        "SELECT SUM(profit) as profit FROM carts WHERE mobile = ?",
        [mobile],
        (er, invest) => {
          
          if (er) console.log(er);

          const profit = invest[0].profit === null ? 0 : parseInt(invest[0].profit)

          if(profit !== null){
            res.send({status:true, msg:profit})
          }else{
            res.send({status:false, msg:profit})
          }

        }
      );

      con.release()
    });
  } catch (error) {
    console.log(error);
  }
};


module.exports.dailyIncome = (req, res) => {

  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      con.query(
        "SELECT SUM(profit) as daily_earnings FROM carts WHERE mobile = ?",
        [mobile],
        (er, invest) => {
          
          if (er) console.log(er);

          const profit = invest[0].daily_earnings === null ? 0 : parseInt(invest[0].daily_earnings)

          if(profit != ""){
            res.send({status:true, msg:profit})
          }else{
            res.send({status:false, msg:profit})
          }

        }
      );

      con.release()
    });
  } catch (error) {
    console.log(error);
  }
};



