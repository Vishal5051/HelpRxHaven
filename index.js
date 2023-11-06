var express = require("express");
// var mysql = require('mysql');
var mysql = require('mysql2');
var fileuploader = require("express-fileupload");
var app = express();
app.listen(2003, function () {
    console.log("server started....");  
});

// access to public folder===============================================
app.use(express.static("public"));
// middleware===============================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// access to fileuploader===============================================
app.use(fileuploader());  

var doconfig = {
    host: '127.0.0.1',
    user: 'root',
    password: "1234",
    database: 'DBMR'
}
var docon = mysql.createConnection(doconfig);
docon.connect(function(err) {
    if (err == null)
    console.log("Connected Successfully...");
    else
    console.log(err);
});
// =============================URL Handler INdex =================================
app.get("/", function (req, resp) {
    
    resp.sendFile(process.cwd() + "/public/index.html");
});
// =============================URL  Handler doner profile=================================
app.get("/profile", function (req, resp) {
    
    resp.sendFile(process.cwd() + "/public/profile_proj.html");
});
// =============================URL Handler avil med page=================================
app.get("/AvilMedic", function (req, resp) {
    
    resp.sendFile(process.cwd() + "/public/avail-med.html");
});
// =============================URL Handler needy page=================================
app.get("/Nprofile", function (req, resp) {
    
    resp.sendFile(process.cwd() + "/public/profile_needy.html");
});
// =============================URL Handler admin dash page=================================
app.get("/admin-dash-angular", function (req, resp) {
    
  resp.sendFile(process.cwd() + "/public/dash-admin.html");
});
// =============================URL Handler needy page=================================
app.get("/users-panel-angular", function (req, resp) {
    
  resp.sendFile(process.cwd() + "/public/panel-users.html");
});
// =============================URL fetch donor data Handler needy page=================================
app.get("/donor-users-panel-angular", function (req, resp) {
    
  resp.sendFile(process.cwd() + "/public/panel-donors.html");
});
// =============================URL fetch needy data Handler needy page=================================
app.get("/needy-users-panel-angular", function (req, resp) {
    
  resp.sendFile(process.cwd() + "/public/panel-needy.html");
});
// =============================URL medicine manager page =================================
app.get("/med-manager-angular", function (req, resp) {
    
  resp.sendFile(process.cwd() + "/public/med-manager.html");
});

// =============================AJAX- email=================================

app.get("/chk-email", function (req, resp) {
    
    docon.query("select * from dbmutdata  where    Emailid=?", [req.query.kuchEmail], function (err,resulttable) {
        if (err == null) 
        {
            if(resulttable.length==1)
            resp.send("Account Aready Exist!!!!!!!!!!!!");
            else
            resp.send("Available.....");
            
        } else {
            resp.send(err);
        }
    });
});

// =============================AJAX-save data=================================
// ... Existing server-side code ...

app.post("/save-data", function(req, resp) {
    var email = req.body.email;
    var password = req.body.password;
    var usertype = req.body.usertype;
    var sql = "INSERT INTO dbmutdata (Emailid, Password,usertype) VALUES (?,?, ?)";
    docon.query(sql, [email, password,usertype], function(err, resultJson) {
       if (err) {
            console.log("Error saving data: ", err);
            resp.send("Error saving data");
            return;
        }
        console.log("Congratulations! You're officially part of our community. Welcome aboard! ");
        resp.send("Congratulations! You're officially part of our community. Welcome aboard!");
  })  
});
  
//=============================AJAX-login data=================================
// app.get("/login-data", function(req, resp) {
//     var email = req.query.email;
//     var password = req.query.password;
    
//     // var type = req.body.type;
//     // var sql = "select * from dbmutdata where emailid=? and password=? ";
//     docon.query("select * from dbmutdata where emailid=? and password=? ", [email, password], function(err, resultjson) {
        
         
//         if(err==null)
//         {
//             if(resultjson.userstatus==1 && resultjson.length==1 )
//             {
//                 resp.send(resultjson[0].usertype);
//                 console.log("Congratulations! You're officially part of our community. Welcome aboard! ");
//         resp.send("Congratulations! You're officially part of our community. Welcome aboard!");


                
//             } else if (resultjson[0].userstatus==0 && resultjson[0].length==1) {
//                 // resp.send(resultjson[0].usertype);
//                 resp.send("Account is Blocked");
                
//             } else { 
//             resp.send("Incorrect Email or Password!!");


                
//             }
//         }else {
//             console.log("Error in logging data: ", err);  
//             resp.send(err);
            
//         }
        
//         // if (err) {
//         //     console.log("Incorrect data: ", err);
//         //     resp.send("Incorrect data");
//         //     return;
//         // }else{

//         //     console.log("Welcome back! Access granted. You're now officially logged in.");
//         //     resp.send("Welcome back! Access granted. You're now officially logged in.");
//         // }

//   })
// });

app.get("/login-data", function (req, resp) {
  docon.query("SELECT * FROM dbmutdata WHERE emailid=? AND password=?", [req.query.email, req.query.password], function (err, resJSON) {
      if (err) {
          resp.status(500).send(err); // Return error status and message
      } else {
          if (resJSON.length === 1) {
              if (resJSON[0].userstatus === 1) {
                  resp.send(resJSON[0].usertype);
              } else {
                  resp.send("Account Blocked");
              }
          } else {
              resp.send("Invalid Email or Password");
          }
      }
  });
});

  //   ===============================================Records donor upload=========================================

app.post("/signup-save-data", function (req, resp) {


    var FileName = "nopic.jpg";

    if (req.files != null) {
        FileName = req.files.photo.name;
        var path = process.cwd() + "/public/upload/" + FileName;
        req.files.photo.mv(path);
    } 
    var Emailid = req.body.inputEmail4;
    var name = req.body.inputname;
    var contact = req.body.inputcontact;
    var address = req.body.inputAddress;
    var citynm = req.body.inpcity;
    
    var state = req.body.inputState;
    var zip = req.body.inputZip;
    var gender = req.body.inputgender;
    var avilfrom = req.body.txttime;
    var avilto =req.body.txttime2;
    
    var idproof = req.body.inputID;

    console.log(req.body);
    // resp.send("   File name=" + FileName);
    // resp.send(emailid);

    docon.query("INSERT INTO dbmut (emailid,name,contact,address, citynm,state,zip,idproof,photonm,avilfrom,avilto ,gender) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?)", [Emailid, name, contact, address, citynm, state, zip, idproof, FileName,avilfrom,avilto,gender], function (err) {

        if (err == null) {
            resp.send("Record saved successfully!");
        } else {
            resp.send(err);
        }
    });
})
  
// ======================================donor file update=========================================

app.post("/Profile-update-data", function (req, resp) 
{


    var FileName;

    if (req.files != null) {
        FileName = req.files.photo.name;
        var path = process.cwd() + "/public/upload/" + FileName;
        req.files.photo.mv(path);
    }
    else{   

        FileName = req.body.hdn;
    }
    var Emailid = req.body.inputEmail4;
    var name = req.body.inputname;
    var contact = req.body.inputcontact;
    var address = req.body.inputAddress;
    var citynm = req.body.inpcity;
    var gender = req.body.inputgender;


    var state = req.body.inputState;
    var zip = req.body.inputZip;
    var avilfrom = req.body.txttime;
    var avilto =req.body.txttime2;
    
    var idproof = req.body.inputID;

    console.log(req.body);
    // resp.send("   File name=" + FileName);
    // resp.send(emailid);

    
    docon.query("update  dbmut set name=?, contact=?, address=?, citynm=?, state=?, zip=?, avilfrom=?, avilto=?, idproof=?,photonm=?,gender=? where Emailid=?", [name,contact,address,citynm,state,zip,avilfrom,avilto,idproof,FileName,gender ,Emailid], function(err) {
        if (err == null) {
            resp.send("Record updated successfully!");
        } else {
            resp.send(err);
        }
    });
})

    
// -----------------------------------------search-data-donner-JSOOOOOOOOOOOOONNNNNNNNN-----------------------------------------------
app.get("/get-json-record", function (req, resp) {
  console.log(req.query);
  // Parameter should be 'kuchEmail' instead of 'req.query.kuchEmail'
  docon.query("select * from dbmut where emailid=?", [req.query.kuchEmail], function (err, resultTableJSON) {
      if (err == null) {
          resp.send(resultTableJSON);
      } else {
          resp.send(err);
      }
  });
});

// ================================Avil-med-data-save================================
app.post("/avilmed-save-data", function(req, resp) {
    var email = req.body.AMemail;
    var med = req.body.AMmed;
    var exdate = req.body.AMexdate;
    var packaging = req.body.AMpackage;
    var qunty = req.body.AMqunty;
    var sql = "INSERT INTO medsavailable (emailid, med,expdate,packing,qty) VALUES (?,?,?,?,?)";
    docon.query(sql, [email, med,exdate,packaging,qunty], function(err, resultJson) {
       if (err) {
            console.log("Error saving Medicine data: ", err);
            resp.send("Error saving Medicine data");
            return;
        }
        console.log("Your data preserved! Our team will promptly contact you.");
        resp.send("Your data preserved! Our team will promptly contact you.");
  })
}); 
// -----------------------------------------search-data-needy-JSOOOOOOOOOOOOONNNNNNNNN------------------------------------------------------------
app.get("/get-json-record-needy",function(req,resp)
{
  console.log(req.query);
         //fixed                             //same seq. as in table
         docon.query("select * from dbmutneedy where emailid=?",[req.query.kuchEmail],function(err,resultTableJSON)
    {
        console.log(resultTableJSON) ;
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
            // console.log(JSON.stringify(err));
    })
})
// app.get("/get-json-record-needy", function (req, resp) {
//   //fixed                             //same seq. as in table
//   docon.query("select * from dbmutneedy where emailid=?", [req.query.kuchEmail], function (err, resultTableJSON) {
//         if (err == null)
//               //  console.log("profile exist")
//               resp.send(resultTableJSON);
//         // resp.send("profile exist");
//         else
//               resp.send(err);
//       })
// })
 //   ===============================================Records needy upload=========================================

 app.post("/needy-save-data", function (req, resp) {


    var FileName = "nopic.jpg"; 

    if (req.files != null) {
        FileName = req.files.photo.name;
        var path = process.cwd() + "/public/upload/" + FileName;
        req.files.photo.mv(path);
    }
    var Emailid = req.body.inputEmail4;
    var name = req.body.inputname;
    var contact = req.body.inputcontact;
    var address = req.body.inputAddress;
    var citynm = req.body.inpcity;

    var state = req.body.inputState;
    var zip = req.body.inputZip;
   
    var idproof = req.body.inputID;

    console.log(req.body);
    // resp.send("   File name=" + FileName);       
    // resp.send(emailid);

    docon.query("INSERT INTO dbmutneedy (emailid,name,contact,address, citynm,state,zip,idproof,photonm) VALUES (?, ?,?,?,?,?,?,?,?)", [Emailid, name, contact, address, citynm, state, zip, idproof, FileName], function (err) {

        if (err == null) {
            resp.send("Record saved successfully!");
        } else {
            resp.send(err);
        }
    });
})
  // ======================================needy file update=========================================

app.post("/NeedyProfile-update-data", function (req, resp) 
{


    var FileName;

    if (req.files != null) {
        FileName = req.files.photo.name;
        var path = process.cwd() + "/public/upload/" + FileName;
        req.files.photo.mv(path);
    }
    else{

        FileName = req.body.hdn;
    }
    var Emailid = req.body.inputEmail4;
    var name = req.body.inputname;
    var contact = req.body.inputcontact;
    var address = req.body.inputAddress;
    var citynm = req.body.inpcity;

    var state = req.body.inputState;
    var zip = req.body.inputZip;
   
    var idproof = req.body.inputID;

    console.log(req.body);
    // resp.send("   File name=" + FileName);
    // resp.send(emailid);

    
    docon.query("update  dbmutneedy set name=?, contact=?, address=?, citynm=?, state=?, zip=?, idproof=?,photonm=? where Emailid=?", [name,contact,address,citynm,state,zip,idproof,FileName, Emailid], function(err) {
        if (err == null) {
            resp.send("Record updated successfully!");
        } else {
            resp.send(err);
        }
    });
})
//   ===============================================Chnage Password donor=========================================
app.post("/chng-pwd", function (req, res) {
    var email = req.body.kuchEmail;
    var oldPwd = req.body.kuchop;
    var newPwd = req.body.kuchnp;
    var confirmPwd = req.body.kuchcp;
  
    console.log(req.body);
  
    // Check if the new password and confirm password match
    if (newPwd !== confirmPwd) {
      res.status(400).send("New password and confirm password do not match");
      return;
    }
  
    // Query the database to fetch the user's current password
    docon.query("SELECT password FROM dbmutdata WHERE emailid = ?", [email], function (err, result) {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).send("Error executing SQL query");
        return;
      }
  
      // Check if the user exists and the old password matches
      if (result.length === 0) {
        res.send('User not found');
        return;
      }
  
      var dbPwd = result[0].password;
  
      if (oldPwd !== dbPwd) {       
        res.send('Incorrect old password');
        return;
      }
      if(dbPwd==newPwd ){
        res.send("Old Password and New Password Can,t be same!!");
        return;
      }
  
      // Update the password in the database
      docon.query("UPDATE dbmutdata SET password = ? WHERE emailid = ?", [newPwd, email], function (err) {
        if (err) {
          console.error('Error updating password:', err);
          res.status(500).send('Error updating password');
          return;
        }
  
        res.send("Password updated successfully!");
      });
    });
  });
//   ===============================================Chnage Password needy=========================================
app.post("/chng-pwd-needy", function (req, res) {
    var email = req.body.kuchEmail;
    var oldPwd = req.body.kuchop;
    var newPwd = req.body.kuchnp;
    var confirmPwd = req.body.kuchcp;
  
    console.log(req.body);
  
    // Check if the new password and confirm password match
    if (newPwd !== confirmPwd) {
      res.status(400).send("New password and confirm password do not match");
      return;
    }
  
    // Query the database to fetch the user's current password
    docon.query("SELECT password FROM dbmutdata WHERE emailid = ?", [email], function (err, result) {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).send("Error executing SQL query");
        return;
      }
  
      // Check if the user exists and the old password matches
      if (result.length === 0) {
        res.send('User not found');
        return;
      }
  
      var dbPwd = result[0].password;
  
      if (oldPwd !== dbPwd) {       
        res.send('Incorrect old password');
        return;
      }
      if(dbPwd==newPwd ){
        res.send("Old Password and New Password Can,t be same!!");
        return;
      }
  
      // Update the password in the database
      docon.query("UPDATE dbmutdata SET password = ? WHERE emailid = ?", [newPwd, email], function (err) {
        if (err) {
          console.error('Error updating password:', err);
          res.status(500).send('Error updating password');
          return;
        }
  
        res.send("Password updated successfully!");
      });
    });
  });
  
//  ========================================= angular fetch data=========================================
app.get("/fetch-angular-json-data",function(req,resp)
{
         //fixed                             //same seq. as in table
         docon.query("select * from dbmutdata ",function(err,resultTableJSON)
    {
        // console.log(respJSONKuch) ;
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
// =============angular delete userid===================
app.get("/delete-userid-angular",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    docon.query("delete from dbmutdata where emailid=?",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
// =============angular blocked  userid===================

app.get("/block-userid-angular",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    docon.query("update  dbmutdata set userstatus=0 where emailid=? ",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)

            resp.send("User Blocked Successfully!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
// =============angular blocked  userid===================
app.get("/unblock-userid-angular",function(req,resp)
{
     //saving data in table
    var email=req.query.emailkuch;
    

         //fixed                             //same seq. as in table
    docon.query("update  dbmutdata set userstatus=1 where emailid=? ",[email],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)

            resp.send("User unBlocked Successfully!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})
//  ========================================= angular fetch donor  data=========================================
app.get("/fetch-donor-angular-json-data",function(req,resp)
{
         //fixed                             //same seq. as in table
         docon.query("select * from dbmut ",function(err,resultTableJSON)
    {
        // console.log(respJSONKuch) ;
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
//  ========================================= angular fetch needy  data=========================================
app.get("/fetch-needy-angular-json-data",function(req,resp)
{
         //fixed                             //same seq. as in table
         docon.query("select * from dbmutneedy ",function(err,resultTableJSON)
    {
        // console.log(respJSONKuch) ;
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
// =============angular delete mddicine by user===================
app.get("/delete-medicine-record-angular",function(req,resp)
{
     //saving data in table
    var serialno=req.query.srno;
    

         //fixed                             //same seq. as in table
    docon.query("delete from medsavailable where srno=?",[serialno],function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Account Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
            else
              resp.send("Inavlid Email id");
            }
              else
            resp.send(err);
    })
})

//  ========================================= angular fetch medicine record of donor  data=========================================
app.get("/fetch-medicine-record-donor-angular-json-data",function(req,resp)
{   var id=req.query.emailid;
  // console.log(id);
         //fixed                             //same seq. as in table
         docon.query("select * from medsavailable where emailid=?",[id],function(err,resultTableJSON)
    {
        // console.log(respJSONKuch) ;
          if(err==null)
            resp.send(resultTableJSON);
              else
            resp.send(err);
    })
})
// ===============================fetch city name============================

app.get("/get-citiess",function(req,resp)
{
         //fixed                             //same seq. as in table
    docon.query("select distinct citynm from dbmut",function(err,resultTableJSON)
    {
      if(err==null)
      resp.send(resultTableJSON);
              else
            resp.send(err);
          })
})
// ===============================fetch medicine name============================

app.get("/get-medicines",function(req,resp)
{
  //fixed                             //same seq. as in table
    docon.query("select distinct med from medsavailable",function(err,resultTableJSON)
    {
          if(err==null)
          resp.send(resultTableJSON);
              else
            resp.send(err);
          })
})
          //  ========================================= angular fetch card of  medicine record of donor  data=========================================
          app.get("/fetch-donors",function(req,resp)
          {    console.log(req.query);
            var med=req.query.medKuch;
            var city=req.query.cityKuch;
          
          
                   //fixed                             //same seq. as in table
                   docon.query("select  dbmut.name,dbmut.contact,dbmut.address,dbmut.photonm,medsavailable.packing,medsavailable.emailid,medsavailable.med,medsavailable.expdate,dbmut.avilfrom,dbmut.avilto  from dbmut inner join  medsavailable on dbmut.emailid=medsavailable.emailid  where medsavailable.med=? and dbmut.citynm=?",[med,city],function(err,resultTableJSON)
                   
              {
                  // console.log(respJSONKuch) ;
                    if(err==null) 
                      resp.send(resultTableJSON);
                        else
                      resp.send(err);
              })
          })
          
      

//   //  ========================================= angular fetch medicine record of donor  data to delete data record of exoired medicine=========================================
// app.get("/fetch-medicine-exp-record-donor-json-data",function(req,resp)
// {
//   // console.log(id);
//          //fixed                             //same seq. as in table
//          docon.query("select * from medsavailable",function(err,resultTableJSON)
//     {
//         // console.log(respJSONKuch) ;
//           if(err==null)
//             resp.send(resultTableJSON);
//               else
//             resp.send(err);
//     })
// })

// =============angular delete expire medicine===================

app.get("/delete-expmed-angular",function(req,resp)
{
    

         //fixed                             //same seq. as in table
    docon.query("delete from medsavailable where expdate<=current_date()",function(err,result)
    {
          if(err==null)
          {
            if(result.affectedRows==1)
              resp.send("Expired medicine Removed Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
              }
              else
            resp.send(err);
    })
})


