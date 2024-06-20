const { sql } = require("../sql");

var voucher = require("voucher-code-generator");

module.exports.addUser = (req, res) => {
  const { mobile, password, ref } = req.body;

  const reff = voucher.generate({
    length: 8,
    count: 1,
  });

  try {
    if (mobile.trim() === "" || password.trim() === "") {
      res.send({ status: false, msg: "All Fields are required!" });
    } else {
      sql.getConnection((e, con) => {
        if (e) console.log(e);
        con.query(
          "SELECT * FROM users WHERE name = ?",
          [mobile],
          (er, user) => {
            if (er) console.log(er);

            if (user != "") {
              res.send({ status: false, msg: "Mobile NO. already exist!" });
            } else {
              con.query(
                "INSERT INTO users(name, password, referral) VALUES(?,?,?)",
                [mobile, password, reff[0]],
                (err, suc) => {
                  if (err) console.log(err);

                  if (suc) {
                    res.send({ status: true, msg: "Sign up successful" });

                    if (ref.trim() !== "") {
                      con.query(
                        "INSERT INTO referrals(ref, mobile, referee) VALUE(?,?,?)",
                        [ref, mobile, reff[0]],
                        (error, r) => {
                          if (error) console.log(error);
                        }
                      );
                    }
                  } else {
                    res.send({ status: false, msg: "something went wrong" });
                  }
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

module.exports.getUser = (req, res) => {
  const { mobile, password } = req.body;

  try {
    if (mobile === "" || password === "") {
      res.send({ status: false, msg: "All fields required!" });
    } else {
      sql.getConnection((e, con) => {
        if (e) console.log(e);

        con.query(
          "SELECT * FROM users WHERE name = ? AND password = ?",
          [mobile, password],
          (er, user) => {
            if (er) console.log(er);

            if (user != "") {
              res.send({ status: true, msg: user[0] });
              // con.query("SELECT SUM(amount) as balance FROM wallet WHERE mobile = ?",[username], (err, wallet)=>{

              //     if(err) console.log(err)

              //     res.render("index", {userData})

              //     con.query("SELECT * FROM withdrawals WHERE mobile = ?", [username], (error, withdrawal)=>{

              //         if(error) console.log(error)

              //         con.query("SELECT SUM(earning) as earning FROM earnings WHERE mobile = ?", [username], (errorr, earning)=>{
              //                 if(errorr) console.log(errorr)

              //                 res.render("index",{username,userId})
              //             // console.log(wallet[0].balance)
              //             })
              //     })

              // })
            } else {
              // res.redirect("/login")
              res.send({ status: false, msg: "Invalid Username OR Password" });
            }
          }
        );
        con.release();
      });
    }
  } catch (error) {
    console.log(error);
  }

  // res.render("login")
};

module.exports.getAllUsers = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT users.referral AS user, users.name AS mobile, COUNT(referrer.referee) AS level1, COUNT(referrals.referee) AS level2, COUNT(referred.referee) AS level3, SUM(cart1.product_price) AS cart1, SUM(cart2.product_price) AS cart2, SUM(cart3.product_price) AS cart3 FROM users LEFT JOIN referrals AS referrer ON referrer.ref = users.referral LEFT JOIN referrals ON referrals.ref = referrer.referee LEFT JOIN referrals AS referred ON referred.ref = referrals.referee LEFT JOIN carts AS cart1 ON cart1.mobile = referrer.mobile LEFT JOIN carts AS cart2 ON cart2.mobile = referrals.mobile LEFT JOIN carts AS cart3 ON cart3.mobile = referred.mobile",
        (er, users) => {
          if (er) console.log(er);

          if (users != "") {
            res.send({ status: true, msg: users });
            console.log(users);
          } else {
            res.send({ status: false, msg: "No User Found" });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.searchUser = (req, res) => {
  const { search } = req.params;

  // console.log(search)

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT users.referral AS user, COUNT(referrer.referee) AS level1, COUNT(referrals.referee) AS level2, COUNT(referred.referee) AS level3, SUM(cart1.product_price) AS cart1, SUM(cart2.product_price) AS cart2, SUM(cart3.product_price) AS cart3 FROM users LEFT JOIN referrals AS referrer ON referrer.ref = users.referral LEFT JOIN referrals ON referrals.ref = referrer.referee LEFT JOIN referrals AS referred ON referred.ref = referrals.referee LEFT JOIN carts AS cart1 ON cart1.mobile = referrer.mobile LEFT JOIN carts AS cart2 ON cart2.mobile = referrals.mobile LEFT JOIN carts AS cart3 ON cart3.mobile = referred.mobile",
        (er, users) => {
          if (er) console.log(er);

          if (users != "") {
            res.send({ status: true, msg: users });
            console.log(users);
          } else {
            res.send({ status: false, msg: "No User Found" });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.totalUsers = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT COUNT(*) as total FROM users", (er, total) => {
        if (er) console.log(er);

        res.send({ status: true, msg: total });
      });
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.totalReferrals = (req, res) => {
  const { id } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT COUNT(*) as total FROM referrals WHERE ref = ? ",
        [id],
        (er, total) => {
          if (er) console.log(er);

          res.send({ status: true, msg: total || 0 });
          console.log(total);
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.userData = (req, res) => {
  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT SUM(wallet.amount) as deposit, SUM(withdrawals.amount) as withdraw, SUM(checkins.amount) as checkin, SUM(carts.product_price) as invest, SUM(carts.profit) as profit FROM wallet LEFT JOIN withdrawals ON withdrawals.mobile = wallet.mobile LEFT JOIN checkins ON checkins.mobile = wallet.mobile LEFT JOIN carts ON carts.mobile = wallet.mobile WHERE wallet.mobile = ?",
        [mobile],
        (er, history) => {
          if (er) console.log(er);
          res.send({ status: true, msg: history });
          // console.log({history})
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.referral = (req, res) => {
  const { referral } = req.params;
  // console.log(referral)
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT referral FROM users WHERE referral = ? LIMIT 1",
        [referral],
        (er, ref) => {
          if (er) console.log(er);

          if (ref != "") {
            res.send({ status: true, msg: ref[0].referral });
          } else {
            res.send({
              status: false,
              msg: "Please get a Valid Link to Refer you",
            });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getReferrals = (req, res) => {
  const { ref } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        `SELECT 
    users.referral AS user, 
    COUNT(DISTINCT referrer.referee) AS level1, 
    COUNT(DISTINCT referrals.referee) AS level2, 
    COUNT(DISTINCT referred.referee) AS level3 
FROM 
    users 
LEFT JOIN 
    referrals AS referrer 
    ON referrer.ref = users.referral 
LEFT JOIN 
    referrals AS referrals 
    ON referrals.ref = referrer.referee 
LEFT JOIN 
    referrals AS referred 
    ON referred.ref = referrals.referee 
WHERE 
    users.referral = ? 
GROUP BY 
    users.referral;
`,
        [ref],
        (er, bonus) => {
          if (er) console.log(er);

          if (bonus != "") {
            const totallevel1 = bonus[0].level1;
            const totallevel2 = bonus[0].level2;
            const totallevel3 = bonus[0].level3;
            const totalsummary = totallevel1 + totallevel2 + totallevel3;
            res.send({
              status: true,
              msg: { totallevel1, totallevel2, totallevel3, totalsummary },
            });
          } else {
            res.send({
              status: false,
              msg: { refs: 0, mobile: 0, bonuses: 0 },
            });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

// ALL LEVEL 1 - LEVEL 3 REFERRALS

// SELECT
// users.referral AS user,
// COUNT(DISTINCT referrer.referee) AS level1,
// COUNT(DISTINCT referrals.referee) AS level2,
// COUNT(DISTINCT referred.referee) AS level3
// FROM users
// LEFT JOIN referrals AS referrer ON referrer.ref = users.referral
// LEFT JOIN referrals ON referrals.ref = referrer.referee
// LEFT JOIN referrals AS referred ON referred.ref = referrals.referee
// WHERE users.referral = '8Ag6hanW';
