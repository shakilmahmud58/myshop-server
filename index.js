const express = require("express");

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.shiwe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    const my_db = client.db("Mydatabase");
    const products= my_db.collection('products');
    const admin= my_db.collection('admin');
    const reviews= my_db.collection('reviews');
    const orders= my_db.collection('orders');

    app.post('/addadmin', async(req,res)=>{
      const data = req.body;
      await admin.insertOne(data,(err,result)=>{
        if(err) throw err;
        else res.send(result);
      });
    })

    app.post('/admincheck', (req,res)=>{
      const email = req.body.email;
      const query= {email:email};
      admin.find(query).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });
    })

    app.post('/addproducts', async(req,res)=>{
      const data = req.body;
      await products.insertOne(data,(err,result)=>{
        if(err) throw err;
        else res.send(result);
      });
    })


    app.get('/getproducts',async (req,res)=>{
      await products.find({}).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });
    })


        //request accept 
    app.post('/acceptrequest',async(req,res)=>{
        const id = req.body.id;
        const query = {_id : ObjectId(id)};
        const update= {$set : {request : 1}};
        await orders.updateOne(query,update,(err,result)=>{
             if (err) throw err;
             else res.send(result);
          });
    
     })
    app.get('/getorders',async (req,res)=>{
      await orders.find({}).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });
    })
    app.get('/getreviews',async (req,res)=>{
      await reviews.find({}).toArray((err,result)=>{
        if(err) throw err;
        else
           res.send(result);

      });
    })


         //delete place


    app.post('/deleteproduct',async(req,res)=>{
        const id = req.body.id;
        const query = {_id : ObjectId(id)};
        await products.deleteOne(query,(err,result)=>{
            if (err) throw err;
             else res.send(result);
        });
      
    })
       
       
    app.post('/deleteorders',async(req,res)=>{
          const id = req.body.id;
          const query = {_id : ObjectId(id)};
          await orders.deleteOne(query,(err,result)=>{
                 if (err) throw err;
                 else res.send(result);
          });
      
       })

    app.get('/product/:id', async(req,res)=>{
      const id = req.params.id;

      await products.find({_id : ObjectId(id)}).toArray((err,result)=>{
        if (err) throw err;
        else res.send(result);
      })
     // console.log(id);
    })


    app.post('/myorders', async(req,res)=>{
      const email = req.body.email;
      const query ={email:email};
      await orders.find(query).toArray((err,result)=>{
        if (err) throw err;
        else res.send(result);
      })
     // console.log(id);
    })

    app.post('/purchase', async(req,res)=>{
      const data = req.body;
      await orders.insertOne(data,(err,result)=>{
        if(err) throw err;
        else res.send(result);
      });
    })


    app.post('/addreview', async(req,res)=>{
      const data = req.body;
      await reviews.insertOne(data,(err,result)=>{
        if(err) throw err;
        else res.send(result);
      });
    })

    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('This is from node express');
});

const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("Listening at 5000");
})

