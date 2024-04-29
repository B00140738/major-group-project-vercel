import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function GET(req, res) {
  // Make a note we are on
  // the api. This goes to the console.
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')
  const pass = searchParams.get('pass')

  // =================================================
  
  const { MongoClient } = require('mongodb');
  //const url = 'mongodb://root:example@localhost:27017/';
  const url = 'mongodb+srv://b00140738:YtlVhf9tX6yBs2XO@cluster0.j5my8yy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(url);
  const dbName = 'app'; // database name
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('login'); // collection name

  const findResult = await collection.find({"username":
  email}).toArray();
  console.log('Found documents =>', findResult);
  const bcrypt = require('bcrypt');
  let hashResult = bcrypt.compareSync(pass, findResult[0].pass); // true
  console.log("checking " + findResult[0].pass);
  console.log("Hash Comparison Result " + hashResult);

  let valid = false
  if(findResult.length >0 ){
  valid = true;
  }

  if(findResult.length >0 && hashResult == true){
    valid = true;
    console.log("login valid")
    // save a little cookie to say we are authenticated
    console.log("Saving username and auth status")
    valid = true;
    cookies().set('auth', true);
    cookies().set('username', username);
    cookies().set('userId', findResult._id.toString()); // Store userId as string
    } else {
    valid = false;
    console.log("login invalid")
  }
  return Response.json({ "data":"" + valid + ""})
}