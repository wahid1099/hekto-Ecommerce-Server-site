const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");

//defualt port
const port = process.env.PORT || 7000;
//middlewares
app.use(cors());
app.use(express.json());

//connection string in mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.byzxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
//connecting database
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    //making connection with database
    await client.connect();
    console.log("databse connection established");
    //creating databse and ollections
    const database = client.db("Ecomnerce");
    const productCollection = database.collection("AllProducts");
    const userCollection = database.collection("Users");
    const reviewCollection = database.collection("Reviews");
    const orderCollection = database.collection("Orders");
    const serviceCollection = database.collection("ourServices");

    ///////////getting all products api calls
    app.get("/allproducts", async (req, res) => {
      const cursor = productCollection.find({});
      const allproducts = await cursor.toArray();
      res.json(allproducts);
    });

    /////////getting specific products with product id

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const singleproducts = await productCollection.findOne(query);
      res.json(singleproducts);
    });
    ///////////////adding new product to database
    app.post("/addproduct", async (req, res) => {
      const addproduct = req.body;
      const productresult = await productCollection.insertOne(addproduct);
      // console.log(carresult);
      res.json(productresult);
    });

    ////deleting products api for admin
    app.delete("/deleteproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
    });

    //getting all user reviews
    app.get("/allreviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const allreview = await cursor.toArray();
      res.json(allreview);
    });

    //user review adding to databset
    app.post("/addReview", async (req, res) => {
      const userReview = req.body;
      const Reviewresult = await reviewCollection.insertOne(userReview);
      // console.log(carresult);
      res.json(Reviewresult);
    });

    //order service collection
    app.post("/placeorder", async (req, res) => {
      const orderinfo = req.body;
      const orderresult = await orderCollection.insertOne(orderinfo);
      res.json(orderresult);
    });

    //getting specific user order with email
    app.get("/userorders", async (req, res) => {
      const email = req.query.email;
      const query = { useremail: email };
      const cursor = orderCollection.find(query);
      const userordered = await cursor.toArray();
      res.json(userordered);
    });
    //allusers oders for admin users
    app.get("/allorders", async (req, res) => {
      const cursor = orderCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    //deleting order api for admin site
    app.delete("/deleteorder/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    ///////////getting all services
    app.get("/allservices", async (req, res) => {
      const cursor = serviceCollection.find({});
      const allservices = await cursor.toArray();
      res.json(allservices);
    });
  } finally {
    //do something w
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("welcome to Ecommerce hekto!");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
