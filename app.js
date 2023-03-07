// const express = require("express");
// const bodyParser = require("body-parser");
// const fs = require('fs');
// //const filePath = path.join("/tmp", "coupon.json");
// //fs.writeFileSync(filePath, JSON.stringify(data));
// const app= express();
// app.use(bodyParser.urlencoded({extended:true}));
// app.set("view engine","ejs");
// app.use(express.static("public"));

// //Date 
// const date = new Date();

// let day = date.getDate();
// let month = date.getMonth() + 1;
// let year = date.getFullYear();

// // This arrangement can be altered based on how we want the date's format to appear.
// let currentDate = `${day}-${month}-${year}`;

// function addZero(i) {
//     if (i < 10) {i = "0" + i}
//     return i;
//   }
//   let h = addZero(date.getHours());
//   let m = addZero(date.getMinutes());
//   let s = addZero(date.getSeconds());
//   let time = h + ":" + m + ":" + s;
  


//   let status =null;

// app.get("/",(req,res)=>{
//     let active_count =0;
//     let noscoup = JSON.parse(fs.readFileSync("coupon.json"));
//         noscoup.forEach((cc)=>{
//             if(cc.active_status==="TRUE"){
//                 active_count++;
//             }
//         })
  
//     res.render("display",{status,active_count});
// });

// app.post("/",(req,res)=>{

//     const ccode =Math.floor(req.body.search);
//     //console.log(ccode)
    

//     try {
//         let coupons = JSON.parse(fs.readFileSync("coupon.json"));
//         coupons.forEach((coupon)=>{
//             if(ccode<1207280 || ccode>1208378){
//                 status={status:"Invalid",msg:"Invalid"};
//             }
//             if(ccode === coupon.Serial_nos){
//                 if (coupon.active_status === "FALSE"){
//                     console.log('offer applied');
//                     coupon.active_status="TRUE";
//                     coupon.date = currentDate;
//                     coupon.time = time;
//                     fs.writeFile("coupon.json",JSON.stringify(coupons,null,2),(err)=>{
//                         if(err) console.log(err);
//                     });
//                     active_count++;
//                     status={status:"Sucess",msg:"You have successfully availed your offer!!"};
                    
//                 }else if(coupon.active_status === "TRUE"){
//                  let temp=`Used at ${coupon.date} ${coupon.time}`;
//                    status={status:"used",msg:temp};
            
//                 }
//                 // else{
//                 //     status="null"
//                 // }

//             }
//             res.redirect("/");
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })

// app.listen(3000,()=>
// {
//     console.log("Server is Started at localhost:3000");
// })


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fs = require('fs');


const app= express();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));


mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://deep:deep@cluster0.vbfg5lc.mongodb.net/couponDB", {useNewUrlParser : true});

const CouponScheema = mongoose.Schema({
    serial_nos : Number,
    active_status : String,
    date : String,
    time : String
});

const Coupon = mongoose.model("coupon",CouponScheema);


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
  let currtime = h + ":" + m + ":" + s;

  let count=0;
  let status=null;

app.get("/",(req,res)=>{
    setTimeout(() => {
        console.log('waiting....');
    res.render("display",{status,count});
    
}, 1000);
});

app.post("/",(req,res)=>{

    const ccode =Math.floor(req.body.search);
    const inc = async (n)=>{
        count = await count+1;
    }
    const update = async (ccode)=>{
        const data = await Coupon.updateOne({serial_nos:ccode},{$set:{active_status:"TRUE",date:currentDate,time:currtime}});
        status={status: "Success", msg:"availed Successfully!!"};
        inc(count)
        
        
    }

    const check = async (ccode)=>{
        const coupon = await Coupon.findOne({serial_nos: ccode});
            if (coupon.active_status === "FALSE"){
                update(ccode);
            }else{
                let temp = `Used at ${coupon.date} ${coupon.time}`;
                status={status:"alredy_used",msg:temp};
            }
    }


    if(ccode==null){
        status=null;
    }else if(ccode<1207280 || ccode>1208378){
        status={status:"Invalid",msg:"Invalid"};
    }
    else{
        check(ccode);
    }
    res.redirect("/");
})



app.listen(3000,()=>
{
    console.log("Server is Started at localhost:3000");
})