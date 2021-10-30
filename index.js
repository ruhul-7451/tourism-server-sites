const express = require('express')
const app = express()
const port = 5000
var cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwfat.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {

    try {
        await client.connect();
        const database = client.db("bookMyTrip");
        const tourCollection = database.collection("tours");

        // insert a document
        app.post('/destination', async (req, res) => {
            const doc = req.body
            const result = await tourCollection.insertOne(doc);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        });

        // get a document
        app.get('/destination', async (req, res) => {
            const query = {};
            const cursor = tourCollection.find(query);
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            const result = await cursor.toArray();
            res.send(result);
        });

        //get single item from a document by id
        app.get('/destination/:tripId', async (req, res) => {
            console.log('single destination hit');
            const id = req.params.tripId
            const query = { _id: ObjectId(id) };
            const result = await tourCollection.findOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`I am running on http://localhost:${port}`)
})