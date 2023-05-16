const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// Connect to DB

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.0nsziui.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // create collection in DB
        const productsCollection = client.db('productsDB').collection('products')
        // Getting items from DB by ida array
        app.post('/productById', async (req, res) => {
            const ids = req.body;
            console.log(ids);
            const objectIds = ids.map(id => new ObjectId(id));
            const query = { _id: { $in: objectIds } }
            const result = await productsCollection.find(query).toArray()
            res.send(result)
        })
        // Read Products from DB
        app.get('/products', async (req, res) => {
            console.log(req.query);
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = page * limit;
            const result = await productsCollection.find().skip(skip).limit(limit).toArray();
            res.send(result)
        })
        // Get the total products of shop from DB
        app.get('/totalProducts', async (req, res) => {

            const result = await productsCollection.estimatedDocumentCount();
            res.send({ totalProducts: result });
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('EMA JOHN SERVER IS RUNNING')
})
app.listen(port, () => {
    console.log('Ema john server is running on port ', port);
})