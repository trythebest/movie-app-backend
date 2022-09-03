
import express, { response } from "express";
import { Client } from "../index.js"
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
const router = express.Router();

async function genHashedpassword(password) {
  const No_Of_rounds = 10;
  const salt = await bcrypt.genSalt(No_Of_rounds);
  //console.log("salt -",salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  //console.log("hashedpassword-",hashedPassword)
  return (hashedPassword)

}
//genHashedpassword("password@123");


router.post('/signup', async function (req, res) {
  // in below step{username,password} is destructre from data variable
  const { username, password } = req.body;
  const hashedpassword = await genHashedpassword(password);
  const isUserExist = await Client.db("mani").collection("users").findOne({ username: username });

  if (isUserExist) {
    res.send({ msg: "user already exist" })
  }
  else {
    const result = await Client.db("mani").collection("users").insertOne({ username: username, password: hashedpassword })
    res.send(result);
  }
})
router.post('/login', async function (req, res) {
  const { username, password } = req.body;
  const userfromdb = await Client.db("mani").collection("users").findOne({ username: username });
  console.log(userfromdb);
  if (!userfromdb) {
    res.status(401).send({ msg: "Invalid Credintals" })
  }
  else {
    const storedpassword = userfromdb.password;
    const ispasswordmatch = await bcrypt.compare(password, storedpassword);
    console.log(ispasswordmatch);

    if (ispasswordmatch) {
      const token=jwt.sign({id:userfromdb._id},process.env.secret_key)// to generate token
      res.send({ msg: "successfull login",token:token })
    }
    else {
      res.send({ msg: "invalid credintals" })
    }
  }
})
export const usersRouter = router;