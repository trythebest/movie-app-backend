
import express from "express";
import {Client} from "../index.js"
import bcrypt from "bcrypt";
const router= express.Router();

async function genHashedpassword(password){
  const No_Of_rounds=10;
  const salt= await bcrypt.genSalt(No_Of_rounds);
  //console.log("salt -",salt);
  const hashedPassword= await bcrypt.hash(password,salt);
  //console.log("hashedpassword-",hashedPassword)
  return(hashedPassword)

}
//genHashedpassword("password@123");

  
  router.post('/signup',async function(req,res){
    // in below step{username,password} is destructre from data variable
    const {username,password}= req.body;
    const hashedpassword= await genHashedpassword(password);
    const isUserExist= await Client.db("mani").collection("users").findOne({username:username});
    const result= await Client.db("mani").collection("users").insertOne({username:username,password:hashedpassword})
     isUserExist ? res.send({msg:"user already exists"}) : res.send(result);
    

    res.send(isUserExist);
  
  })
    export const usersRouter = router;