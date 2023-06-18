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

const counterSchema = mongoose.Schema({
    webcount:String,
    count: Number
});
const counterdb = mongoose.model("counters",counterSchema)

const abc =counterdb.findOneAndUpdate({ webcount:"webcount"}, { $set: { count: 1 } })

app.listen(3000,()=>
{
    console.log("Server is Started at localhost:3000");
})