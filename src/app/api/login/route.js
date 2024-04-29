export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const pass = searchParams.get("pass");

    const { MongoClient } = require('mongodb');
    const url = 'mongodb+srv://b00140738:YtlVhf9tX6yBs2XO@cluster0.j5my8yy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const client = new MongoClient(url);
    const dbName = 'forums';

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('register');

    // Find user by username
    const findResult = await collection.findOne({ "username": username });

    let valid = false;
    const bcrypt = require('bcrypt');
    if (findResult) { // Check if user was found
      let hashResult = bcrypt.compareSync(pass, findResult.pass); // Compare password
      if (hashResult) {
        valid = true;
        res.cookie('auth', true);
        res.cookie('username', username);
        res.cookie('userId', findResult._id.toString()); // Store userId as string
      }
    }

    return res.json({ success: valid }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return res.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}