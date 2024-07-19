const { sql } = require("../sql")



module.exports.addAdmin = (req,res)=>{

    const {mobile, password} = req.body

    try {
        if(mobile.trim() === "" || password.trim() === "" ){
            res.send({status:false, msg:"All Fields are required!"})
        }else{
            sql.getConnection((e, con)=>{
                if(e) console.log(e)

                con.query('SELECT * FROM admins WHERE mobile = ?',[mobile], (er, admin)=>{
                    if(er) console.log(admin)

                    if(admin != ""){
                        res.send({status:false, msg:"Mobile NO. already exist!"})
                    }else{
                        con.query("INSERT INTO admins(mobile, password) VALUES(?,?)",[mobile, password],(er, deposit)=>{
                            if(er) console.log(er)
                        
                            res.send({status:true, msg:"New Admin Added"})
                        })
                    }

                })
                con.release()
            })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports.deleteAdmin = (req,res)=>{

    const {id} = req.params

    try {

            sql.getConnection((e, con)=>{
                if(e) console.log(e)

                con.query("DELETE FROM admins WHERE admin_id = ?", [id], (er, admin)=>{

                    if(er) console.log(er)

                    res.send({status:true, msg: "Admin Deleted!"})
                    
                })
                con.release()
            })
        
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAdmin = (req,res)=>{

    const {mobile, password} = req.body

    try {

        if(mobile.trim() === "" || password.trim() === ""){
            res.send({status:false, msg:"All fields required!"})
        }else{
            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT * FROM admins WHERE mobile = ? AND password = ?", [mobile, password], (er, admin)=>{

                    if(er) console.log(er)

                    if(admin != ""){
                        res.send({status:true, msg:admin})
                    }else{
                        res.send({status:false, msg: "Invalid mobile NO. OR Password"})
                    }
                })
                con.release()
            })
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.getAllAdmins = (req,res)=>{


    try {
       
            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT * FROM admins", (er, admins)=>{

                    if(er) console.log(er)

                    if(admins != ""){
                        res.send({status:true, msg:admins})
                    }else{
                        res.send({status:false, msg: "No Admin Found"})
                    }
                })
                con.release()
            })
        
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.totalAdmins = (req,res)=>{


    try {
       
            sql.getConnection((e, con)=>{

                if(e) console.log(e)

                con.query("SELECT COUNT(*) as total FROM admins", (er, admins)=>{

                    if(er) console.log(er)

                    if(admins != ""){
                        // console.log(admins)
                        res.send({status:true, msg:admins})
                    }else{
                        res.send({status:false, msg: "No Admin Found"})
                    }
                })
                con.release()
            })
        
        
    } catch (error) {
        console.log(error)
    }
}

module.exports.issue = (req, res)=>{

    const {mobile, file, amount} = req.body
    console.log({mobile, file, amount})
    try {
        if(!mobile || !file || !amount){
            res.send({status:false, msg:"All fields requireds"})
        }else{
            sql.getConnection((e, con)=>{
                if(e) console.log(e)

                con.query("INSERT INTO issues(mobile, amount, file) VALUES(?,?,?)", [mobile, amount, file], (er, file)=>{
                    
                    if(e) console.log(e)

                    res.send({status:true, msg:"Your Issue as been submitted"})
                })

                con.release()
            })
        }
    } catch (error) {
        console.log(error)
    }

}

