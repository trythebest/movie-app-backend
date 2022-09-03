
import express from "express";
import {Client} from "../index.js"
import { auth } from "../middleware/auth.js";
import { ObjectId } from "mongodb";
const router= express.Router();


router.get('/', async function (req, res) {
    const movies= await Client
    .db("mani")
    .collection("movies")
    .find({})  // find always returns an cursor(pagination ) it have limit to show data ex: 20; 
    .toArray();// to convert cursor to array.(to show all data without limit)
    res.send(movies);
  })
  
  router.get('/:num',async function (req, res) {
   console.log(req.params);
   const {num}=req.params ;
   //const movie=movies.find((mv)=>mv.id===num)//without mongo db
   const movie= await Client.db("mani").collection("movies").findOne({_id:ObjectId(num)});// to get the data form the mongo db
   movie ? res.send(movie):res.status(404).send({msg : "No such movies find"});
  })
  
  router.post('/',async function(req,res){
    const data= req.body
    console.log(data);
    //insert data in db
    const result= await Client.db("mani").collection("movies").insertMany(data);// client varibale is taken from the connection function it get the information from user
    res.send(result);
  
  })
  router.delete('/:num',auth,async function (req, res) {
    console.log(req.params);
    const {num}=req.params ;
    //const movie=movies.find((mv)=>mv.id===num)//without mongo db
    const movie= await Client.db("mani").collection("movies").deleteOne({_id:ObjectId(num)});// to get the data form the mongo db
    movie.deletedCount > 0 ? res.send(movie):res.status(404).send({msg : "No such movies find"});
   })
  
   router.put('/:num',auth,async function (req, res) {
    const data=req.body;
    console.log(data);
    const {num}=req.params;
    //const movie=movies.find((mv)=>mv.id===num)//without mongo db
    const movie= await Client.db("mani").collection("movies").updateOne({_id:ObjectId(num)},{$set:data});// to get the data form the mongo db
    res.send(movie);
   })
    export const MoviesRouter=router;