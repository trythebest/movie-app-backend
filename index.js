import  express  from "express";
import {MongoClient} from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express()

const movies = [
  { "id": "100", "name": "Iron man 2", "poster": "https://m.media-amazon.com/images/M/MV5BMTM0MDgwNjMyMl5BMl5BanBnXkFtZTcwNTg3NzAzMw@@._V1_FMjpg_UX1000_.jpg", "rating": 7, "summary": "With the world now aware that he is Iron Man, billionaire inventor Tony Stark (Robert Downey Jr.) faces pressure from all sides to share his technology with the military. He is reluctant to divulge the secrets of his armored suit, fearing the information will fall into the wrong hands. With Pepper Potts (Gwyneth Paltrow) and Rhodes (Don Cheadle) by his side, Tony must forge new alliances and confront a powerful new enemy.", "trailer": "https://www.youtube.com/embed/wKtcmiifycU" },
  { "id": "101", "name": "No Country for Old Men", "poster": "https://upload.wikimedia.org/wikipedia/en/8/8b/No_Country_for_Old_Men_poster.jpg", "rating": 8.1, "summary": "A hunter's life takes a drastic turn when he discovers two million dollars while strolling through the aftermath of a drug deal. He is then pursued by a psychopathic killer who wants the money.", "trailer": "https://www.youtube.com/embed/38A__WT3-o0" },
  { "id": "102", "name": "Jai Bhim", "poster": "https://m.media-amazon.com/images/M/MV5BY2Y5ZWMwZDgtZDQxYy00Mjk0LThhY2YtMmU1MTRmMjVhMjRiXkEyXkFqcGdeQXVyMTI1NDEyNTM5._V1_FMjpg_UX1000_.jpg", "summary": "A tribal woman and a righteous lawyer battle in court to unravel the mystery around the disappearance of her husband, who was picked up the police on a false case", "rating": 8.8, "trailer": "https://www.youtube.com/embed/nnXpbTFrqXA" },
  { "id": "103", "name": "The Avengers", "rating": 8, "summary": "Marvel's The Avengers (classified under the name Marvel Avengers\n Assemble in the United Kingdom and Ireland), or simply The Avengers, is\n a 2012 American superhero film based on the Marvel Comics superhero team\n of the same name.", "poster": "https://terrigen-cdn-dev.marvel.com/content/prod/1x/avengersendgame_lob_crd_05.jpg", "trailer": "https://www.youtube.com/embed/eOrNdBpGMv8" },
  { "id": "104", "name": "Interstellar", "poster": "https://m.media-amazon.com/images/I/A1JVqNMI7UL._SL1500_.jpg", "rating": 8.6, "summary": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA\n pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team\n of researchers, to find a new planet for humans.", "trailer": "https://www.youtube.com/embed/zSWdZVtXT7E" },
  { "id": "105", "name": "Baahubali", "poster": "https://flxt.tmsimg.com/assets/p11546593_p_v10_af.jpg", "rating": 8, "summary": "In the kingdom of Mahishmati, Shivudu falls in love with a young warrior woman. While trying to woo her, he learns about the conflict-ridden past of his family and his true legacy.", "trailer": "https://www.youtube.com/embed/sOEg_YZQsTI" },
  { "id": "106", "name": "Ratatouille", "poster": "https://resizing.flixster.com/gL_JpWcD7sNHNYSwI1ff069Yyug=/ems.ZW1zLXByZC1hc3NldHMvbW92aWVzLzc4ZmJhZjZiLTEzNWMtNDIwOC1hYzU1LTgwZjE3ZjQzNTdiNy5qcGc=", "rating": 8, "summary": "Remy, a rat, aspires to become a renowned French chef. However, he fails to realise that people despise rodents and will never enjoy a meal cooked by him.", "trailer": "https://www.youtube.com/embed/NgsQ8mVkN8w" }
];
//const mongo_url="mongodb://localhost";
//mongodb+srv://mani:<password>@cluster0.qaladrg.mongodb.net/?retryWrites=true&w=majority


app.use(express.json()) //inbuilt middleware //use of middleware is to convert the body into json format

const mongo_url= process.env.mongo_url;

async function connection(){
  const Client=new MongoClient(mongo_url)
  await Client.connect() // this place takes a time so thats why use await function
  console.log("mongodb is connected✌😍🤞")
  return Client;
}
const Client = await connection();

app.get('/', function (req, res) {
  res.send("Welcome board😎😍✌");
})

app.get('/movies', async function (req, res) {
  const movies= await Client
  .db("mani")
  .collection("movies")
  .find({})  // find always returns an cursor(pagination ) it have limit to show data ex: 20; 
  .toArray();// to convert cursor to array.(to show all data without limit)
  res.send(movies);
})

app.get('/movies/:num',async function (req, res) {
 console.log(req.params);
 const {num}=req.params ;
 //const movie=movies.find((mv)=>mv.id===num)//without mongo db
 const movie= await Client.db("mani").collection("movies").findOne({id:num});// to get the data form the mongo db
 movie ? res.send(movie):res.status(404).send({msg : "No such movies find"});
})

app.post('/movies',async function(req,res){
  const data= req.body
  console.log(data);
  //insert data in db
  const result= await Client.db("mani").collection("movies").insertMany(data);// client varibale is taken from the connection function it get the information from user
  res.send(result);

})
app.delete('/movies/:num',async function (req, res) {
  console.log(req.params);
  const {num}=req.params ;
  //const movie=movies.find((mv)=>mv.id===num)//without mongo db
  const movie= await Client.db("mani").collection("movies").deleteOne({id:num});// to get the data form the mongo db
  movie.deletedCount > 0 ? res.send(movie):res.status(404).send({msg : "No such movies find"});
 })

 app.put('/movies/:num',async function (req, res) {
  const data=req.body;
  console.log(data);
  const {num}=req.params;
  //const movie=movies.find((mv)=>mv.id===num)//without mongo db
  const movie= await Client.db("mani").collection("movies").updateOne({id:num},{$set:data});// to get the data form the mongo db
  res.send(movie);
 })

app.listen(3000,()=>console.log("App is started in port 3000"))// the port is userdefined


// when ever use await use async for is an defalut