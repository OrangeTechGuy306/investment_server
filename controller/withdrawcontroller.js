const { sql } = require("../sql")





module.exports.requestWithdrawal = (req,res)=>{
    
    const {acc_name, acc_no, amount, bankType, mobile} = req.body
    const status = "PENDING"
    const createdAt = new Date().toDateString()
    
    try {

        if(acc_name.trim() === "" || acc_no.trim() === "" || bankType.trim() === "" || amount.trim() === "" || mobile.trim() === ""){

            res.send({status:false, msg:"All Fields are required!"})

        }else{

            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("INSERT INTO withdrawals(acc_name, acc_no, bank_name, amount, mobile, status, createdAt) VALUES(?,?,?,?,?,?,?)", [acc_name, acc_no, bankType, amount, mobile, status, createdAt],(err, suc)=>{
                    if(err) console.log(err)
                    
                    if(suc) res.send({status:true, msg:"You will be credited within 48hrs"})
    
                })
                con.release()
            })
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports.withdrawals = (req,res)=>{

        try{

            sql.getConnection((e, con)=>{
                
                if(e) console.log(e)

                con.query("SELECT * FROM withdrawals ORDER BY status ASC", (err, withdrawals)=>{
                    if(err) console.log(err)
    
                    if(withdrawals != ""){
                        res.send({status:true, msg:withdrawals})
                    } else{
                        res.send({status:false, msg:"Empty!"})
                    }
    
                })
                con.release()
            })
        
    } catch (error) {
        console.log(error)
    }
}


module.exports.grantWithdrawal = (req,res)=>{
    
    const {with_id, status, mobile} = req.body
    // const status = "TRANSFERRED"

    
    try {
        if(!with_id){
            res.send({status:false, msg:"Something went wrong!"})
        }else{
           sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("UPDATE withdrawals SET status = ? WHERE with_id = ? AND mobile = ?", [status, with_id, mobile],(err, suc)=>{
                if(err) console.log(err)

                if(suc) res.send({status:true, msg:"Transaction Updated"})

            })
            con.release()
           })
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports.requestWithdrawer = (req, res)=>{


    const {mobile} = req.body

    
    try {
        sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("SELECT SUM(amount) as total FROM wallet WHERE mobile = ?",[mobile],(er, deposit)=>{

                if(er) console.log(er)
                    
                
                if(deposit != ""){
                    
                    con.query("SELECT SUM(amount) as total FROM withdrawals WHERE mobile = ?",[mobile], (err, amount)=>{

                        if(err) console.log(err)

                        con.query("SELECT SUM(income) as income, SUM(product_price) as price FROM carts WHERE mobile = ?",[mobile], (error, income)=>{

                            if(error) console.log(error)

                            if(amount[0].total != null && income[0].income != null && income[0].price != null){
                                const returnAmount = parseInt(income[0].income)
                                const price = parseInt(income[0].price)
                                const totalIncome = Math.round((returnAmount / price) * 100)
                                const dep = parseInt(deposit[0].total) // DEPOSITED AMOUNT
                                const wi = parseInt(amount[0].total) // WITHDRAWAL AMOUNT
                                const result =   dep - wi + totalIncome
                                
                                res.send({status: true, msg:result})
                            
                            }else{
                                res.send({status:false, msg:0})
                            }
                        })

                        
                    })
                }else{
                    res.send({status:false, msg:deposit[0].total})
                    // console.log(deposit[0].total)
                }

            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchPendingWithdrawal = (req, res)=>{

    try {
        sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("SELECT * FROM withdrawals WHERE status = ?", ["PENDING"], (er, result)=>{
                
                if(er) console.log(er)
                
                res.send({status:true, msg: result})
            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchTotalPendingWithdrawal = (req, res)=>{

    try {
        sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("SELECT SUM(amount) as total FROM withdrawals WHERE status = ?", ["PENDING"], (er, result)=>{
                
                if(er) console.log(er)
                
                res.send({status:true, msg: result})
            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}



module.exports.fetchTotalWithdrawal = (req, res)=>{

    try {
        sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("SELECT SUM(amount) as total FROM withdrawals", (er, result)=>{
                
                if(er) console.log(er)
                
                res.send({status:true, msg: result})
            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchSuccessWithdrawal = (req, res)=>{

    try {
        sql.getConnection((e, con)=>{

            if(e) console.log(e)

            con.query("SELECT * FROM withdrawals WHERE status = ?", ["TRANSFERRED"], (er, result)=>{

                if(er) console.log(er)
                
                res.send({status:true, msg: result})
            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchTotalSuccessWithdrawal = (req, res)=>{

    try {
        sql.getConnection((e, con)=>{
            if(e) console.log(e)

            con.query("SELECT SUM(amount) as total FROM withdrawals WHERE status = ?", ["TRANSFERRED"], (er, result)=>{

                if(er) console.log(er)
                
                res.send({status:true, msg: result})
            })

            con.release()
        })
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchUserWithdrawalRecords = (req, res)=>{

    const {mobile} = req.params
    // console.log(mobile)
    
    try {
            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT * FROM withdrawals WHERE mobile = ?", [mobile], (er, records)=>{
                    if(er) console.log(er)

                    if(records != ""){
                        res.send({status:true, msg:records})
                    }else{
                        res.send({status:false, msg:"No Record Found"})
                    }
                    
                })

                con.release()
            })

        
    } catch (error) {
        console.log(error)
    }
}


module.exports.fetchUserDepositRecords = (req, res)=>{

    const {mobile} = req.params

    try {
            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT * FROM wallet WHERE mobile = ?", [mobile], (er, records)=>{
                    if(er) console.log(er)

                    if(records != ""){
                        res.send({status:true, msg:records})
                    }else{
                        res.send({status:false, msg:"No Record Found"})
                    }
                    
                })

                con.release()
            })
    } catch (error) {
        console.log(error)
    }
}


module.exports.deleteWithdrawal = (req,res)=>{

    const {with_id, mobile} = req.body

    console.log(req.body)

    try{

        sql.getConnection((e, con)=>{
            
            if(e) console.log(e)

            con.query("DELETE FROM withdrawals WHERE with_id = ? AND mobile = ?",[with_id, mobile], (err, withdrawals)=>{
                if(err) console.log(err)
              
                res.send({status:true, msg:"withdrawal Removed"})
            })
            con.release()
        })
    
} catch (error) {
    console.log(error)
}
}