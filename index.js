const { MongoClient, ServerApiVersion } = require("mongodb");
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
