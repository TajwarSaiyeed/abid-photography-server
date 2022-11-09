const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cj8t2sd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const servicesCollection = client.db("photography").collection("services");
    const messagesCollection = client.db("photography").collection("messages");
    const reviewCollection = client.db("photography").collection("reviews");

    //services 3 service load
    app.get("/services", async (req, res) => {
      const id = req.query.id;
      const query = {};
      const cursor = servicesCollection.find(query);
      if (id === "2") {
        const result = await cursor.limit(2).toArray();
        return res.send(result);
      }
      if (id === "3") {
        const result = await cursor.limit(3).toArray();
        return res.send(result);
      }
      if (id === "") {
        const result = await cursor.toArray();
        res.send(result);
      }
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });

    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    app.post("/messages", async (req, res) => {
      const message = req.body;
      const result = await messagesCollection.insertOne(message);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/review/:serviceId", async (req, res) => {
      const id = req.params.serviceId;
      const query = { serviceId: id };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/updatereview/:reviewId", async (req, res) => {
      const id = req.params.reviewId;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    });

    app.patch("/myreview/:id", async (req, res) => {
      const id = req.params.id;
      const reviewMessage = req.body.review;
      console.log(reviewMessage);
      const query = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          reviewMessage: reviewMessage,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedDoc);
      res.send(result);
    });

    app.get("/myreview", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = reviewCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/myreview/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
  } finally {
  }
};
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
});
