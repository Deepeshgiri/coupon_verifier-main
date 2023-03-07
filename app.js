const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');


const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));


//Date 
const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`;

function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  let h = addZero(date.getHours());
  let m = addZero(date.getMinutes());
  let s = addZero(date.getSeconds());
  let time = h + ":" + m + ":" + s;

  let status=null;

app.get("/",(req,res)=>{
    res.render("display",{status});
});

app.post("/",(req,res)=>{

    const ccode =Math.floor(req.body.search);
    

    try {
        let coupons = JSON.parse(fs.readFileSync("coupon.json"));
        coupons.forEach((coupon)=>{
            if(ccode<1207280 || ccode>1208378){
                status="Invalid";
            }
            if(ccode === coupon.Serial_nos){
                if (coupon.active_status === "FALSE"){
                    console.log('offer applied');
                    coupon.active_status="TRUE";
                    coupon.date = currentDate;
                    coupon.time = time;
                    fs.writeFile("coupon.json",JSON.stringify(coupons,null,2),(err)=>{
                        if(err) console.log(err);
                    });
                    status="Sucess";
                    
                }else{
                    status=`Used at ${coupon.date} ${coupon.time}`;
                }

            }
            res.redirect("/");
        })
    } catch (error) {
        console.log(error);
    }
})






app.listen(3000,()=>
{
    console.log("Server is Started at localhost:3000");
})
