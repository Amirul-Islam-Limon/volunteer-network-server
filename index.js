const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const app = express()
require('dotenv').config()


const port = process.env.PORT || 5050
app.use(cors())
app.use(bodyParser.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvdkd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  

  app.get('/getEvents',(req, res)=>{
    eventCollection.find()
    .toArray((error,documents) =>{
      res.send(documents);
    })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log("new event received", newEvent);
    eventCollection.insertOne(newEvent)
    .then(result=>{
      console.log('inserted count', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/deleteEvent/:id',(req, res)=>{
    const id = ObjectId(req.params.id);
    console.log("connented mogodb", id);
    eventCollection.findOneAndDelete({_id:id})
    .then(result=>{
      res.send("deleted the event")
    })
  })
//   client.close();
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)