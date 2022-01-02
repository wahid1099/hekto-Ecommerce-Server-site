const express = require('express');
const app = express();
const cors=require('cors');
require('dotenv').config();
const ObjectId=require('mongodb').ObjectId;
const{MongoClient}=require('mongodb');



//defualt port
const port=process.env.PORT|| 7000;
//middlewares
app.use(cors());
app.use(express.json());


//connection string in mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.byzxg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
//connecting database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
         //making connection with database
         await client.connect();
         console.log('databse connection established');
          //creating databse and ollections
          const database=client.db('Ecomnerce');
          const productCollection = database.collection('AllProducts');
          const userCollection=database.collection('Users');
          const reviewCollection=database.collection('Reviews');


           ///////////getting all products api calls
         app.get('/allproducts',async (req,res) => {
            const cursor=productCollection.find({});
            const allproducts = await cursor.toArray();
            res.json(allproducts);
        });

       /////////getting specific products with product id
 
            app.get('/products/:id',async (req,res) => {
             const id=req.params.id;
             const query={_id:ObjectId(id)};
             const singleproducts=await productCollection.findOne(query);
             res.json(singleproducts);
               });
           ///////////////adding new product to database
           app.post('/addproduct',async (req,res)=>{
            const addproduct=req.body;
            const productresult=await productCollection.insertOne(addproduct);
           // console.log(carresult);
            res.json(productresult);
        });

               ////deleting products api for admin
                app.delete('/deleteproduct/:id',async(req,res) => {
                    const id=req.params.id;
                    const query={_id:ObjectId(id)};
                    const result=await productCollection.deleteOne(query);
                    res.json(result);
                    });

    }
    finally {
        //do something w
    }
}


run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('welcome to Ecommerce hekto!');
})

app.listen(port,()=>{
    console.log(`listening at ${port}`)
})
