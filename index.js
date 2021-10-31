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
        const orderCollection = database.collection("orders");

        // insert a document
        app.post('/destination', async (req, res) => {
            const doc = req.body
            const result = await tourCollection.insertOne(doc);
            res.send(result);
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
            const id = req.params.tripId
            const query = { _id: ObjectId(id) };
            const result = await tourCollection.findOne(query);
            res.json(result);
        });


        //manage order section//

        // insert booking document
        app.post('/booking', async (req, res) => {
            const doc = req.body
            const result = await orderCollection.insertOne(doc);
            res.send(result);
        });
        //get booking document
        app.get('/booking', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            const result = await cursor.toArray();
            res.send(result);
        });

        //get a specific booking
        app.get('/booking/:bookId', async (req, res) => {
            const id = req.params.bookId
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.findOne(query);
            res.json(result);
        });

        //update booking status
        app.put('/booking/:bookId', async (req, res) => {
            const filter = req.body;
            const updateDoc = {
                $set: {
                    bookingStatus: `Confirmed`
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        //delete myBooking
        app.delete('/booking/:bookId', async (req, res) => {
            const id = req.params.bookId;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('I am Database from mongodb')
})

app.listen(port, () => {
    console.log(`I am running on http://localhost:${port}`)
})