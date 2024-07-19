const { sql } = require("../sql");

module.exports.deposit = (req, res) => {
  const { mobile, amount } = req.body;

  const createdAt = new Date().toDateString();

  try {
    if (mobile.trim() === "" || amount.trim() === "") {
      res.send({ status: false, msg: "All Fields are required!" });
    } else {
      sql.getConnection((e, con) => {
        if (e) console.log(e);

        con.query(
          "SELECT * FROM users WHERE name = ?",
          [mobile],
          (err, user) => {
            if (err) console.log(err);

            if (user != "") {
              con.query(
                "INSERT INTO wallet(amount, mobile, createdAt) VALUES(?,?,?)",
                [amount, mobile, createdAt],
                (er, deposit) => {
                  if (er) console.log(er);

                  if (deposit) {
                    res.send({ status: true, msg: "Deposited Successfully" });
                  }
                }
              );
            } else {
              res.send({ status: false, msg: "User not found" });
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

module.exports.checkin = (req, res) => {
  const { id } = req.params;

  const dailyEarnings = new Date().toDateString();

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT * FROM checkins WHERE mobile = ? AND createdAt = ?",
        [id, dailyEarnings],
        (er, result) => {
          if (er) console.log(er);

          if (result != "") {
            res.send({
              status: false,
              msg: "Come back tomorrow to earn more!",
            });
          } else {
            con.query(
              "INSERT INTO checkins(mobile, amount, createdAt) VALUES(?,?,?)",
              [id, "100", dailyEarnings],
              (err, checkin) => {
                if (err) console.log(err);

                res.send({ status: true, msg: "Bonus Earned!" });
              }
            );
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getUsersDeposit = (req, res) => {
  
  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        `SELECT 
      u.name AS mobile, 
      COALESCE(w.total_deposit, 0) AS deposit, 
      COALESCE(wd.total_withdrawal, 0) AS withdrawal, 
      COALESCE(c.total_checkin, 0) AS checkin, 
      COALESCE(ct.total_profit, 0) AS profit, 
      COALESCE(i.total_invest, 0) AS invest
  FROM 
      users u
  LEFT JOIN 
      (SELECT mobile, SUM(amount) AS total_deposit FROM wallet GROUP BY mobile) w ON w.mobile = u.name
  LEFT JOIN 
      (SELECT mobile, SUM(amount) AS total_withdrawal FROM withdrawals GROUP BY mobile) wd ON wd.mobile = u.name
  LEFT JOIN 
      (SELECT mobile, SUM(amount) AS total_checkin FROM checkins GROUP BY mobile) c ON c.mobile = u.name
  LEFT JOIN 
      (SELECT mobile, SUM(profit) AS total_profit FROM carts GROUP BY mobile) ct ON ct.mobile = u.name
  LEFT JOIN 
      (SELECT mobile, SUM(price) AS total_invest FROM carts GROUP BY mobile) i ON i.mobile = u.name
  WHERE 
      u.name = ?
  `,
        [mobile],
        (er, balance) => {
          if (er) console.log(er);

          const deposit =
            balance[0].deposit === null ? 0 : parseInt(balance[0].deposit);
          const checkin =
            balance[0].checkin === null ? 0 : parseInt(balance[0].checkin);
          const income =
            balance[0].profit === null ? 0 : parseInt(balance[0].profit);
          const invest =
            balance[0].invest === null ? 0 : parseInt(balance[0].invest);
          const withdrawals =
            balance[0].withdrawal === null
              ? 0
              : parseInt(balance[0].withdrawal);

          const incomeAmount = deposit + checkin + income;
          const expenses = invest + withdrawals;
          const accountBalance = incomeAmount - expenses;

          res.send({
            status: true,
            msg: {
              deposit,
              checkin,
              income,
              withdrawals,
              invest,
              accountBalance,
            },
          });
          // console.log(balance)
        }
      );

      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getAllDeposit = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT SUM(amount) as total FROM wallet", (er, deposits) => {
        if (er) console.log(er);

        res.send({ status: true, msg: deposits });
      });
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.allDeposit = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT * FROM wallet", (er, deposits) => {
        if (er) console.log(er);

        res.send({ status: true, msg: deposits });
      });
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteDeposit = (req, res) => {
  const { id } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "DELETE FROM wallet WHERE wallet_id = ?",
        [id],
        (er, deposit) => {
          if (er) console.log(er);

          res.send({ status: true, msg: "Transaction Deleted Successfully" });
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchAllIssues = (req, res) => {
  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query("SELECT * FROM issues", (er, issues) => {
        if (er) console.log(er);

        res.send({ status: true, msg: issues });
      });

      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchSingleIssues = (req, res) => {
  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT * FROM issues WHERE mobile = ?",
        [mobile],
        (er, issues) => {
          if (er) console.log(er);

          res.send({ status: true, msg: issues });
        }
      );

      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchUserDeposit = (req, res) => {
  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT SUM(amount) as deposit FROM wallet WHERE mobile = ?",
        [mobile],
        (er, wallet) => {
          if (er) console.log(er);

          if (wallet[0].deposit !== null) {
            res.send({ status: true, msg: wallet[0].deposit });
          } else {
            res.send({ status: false, msg: 0 });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.fetchUserWithdrawal = (req, res) => {
  const { mobile } = req.params;

  try {
    sql.getConnection((e, con) => {
      if (e) console.log(e);

      con.query(
        "SELECT SUM(amount) as withdrawal FROM withdrawals WHERE mobile = ?",
        [mobile],
        (er, withdrawal) => {
          if (er) console.log(er);

          if (withdrawal[0].withdrawal !== null) {
            res.send({ status: true, msg: withdrawal[0].withdrawal });
          } else {
            res.send({ status: false, msg: 0 });
          }
        }
      );
      con.release();
    });
  } catch (error) {
    console.log(error);
  }
};


// SELECT 
//     users.referral AS user, 
//     COUNT(DISTINCT referrer.referee) AS level1, 
//     COUNT(DISTINCT referrals.referee) AS level2, 
//     COUNT(DISTINCT referred.referee) AS level3,
//     SUM( cart1.profit) AS investment1,
//     SUM( cart2.profit) AS investment2,
//     SUM( cart3.profit) AS investment3
// FROM 
//     users 
// LEFT JOIN 
//     referrals AS referrer 
//     ON referrer.ref = users.referral 
// LEFT JOIN 
//     carts AS cart1 
//     ON cart1.mobile = referrer.mobile
// LEFT JOIN 
//     referrals AS referrals 
//     ON referrals.ref = referrer.referee 
// LEFT JOIN 
//     carts AS cart2 
//     ON cart2.mobile = referrals.referee
// LEFT JOIN 
//     referrals AS referred 
//     ON referred.ref = referrals.referee 
// LEFT JOIN 
//     carts AS cart3 
//     ON cart3.mobile = referred.referee
// WHERE 
//     users.referral = 11111 
// GROUP BY 
//     users.referral;