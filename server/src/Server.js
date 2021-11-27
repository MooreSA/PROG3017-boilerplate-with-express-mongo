let express = require("express");
let cors = require("cors");
let path = require("path");
let sanitize = require("express-sanitizer");
const mongoose = require("mongoose");
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;

// MongoDB constants
const DB_URL = "mongodb://mongo:27017/dbData";
const DB_TECH = "dbTechs";
const DB_COURSE = "dbCourses";

// construct application object via express
let app = express();

app.use(cors()); // Cors Middleware // TODO: remove this line when deploying
app.use(express.json()); // for parsing application/json
app.use(sanitize()); // sanitize request body

const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build"); // Get absolute path to client/build

app.use("/", express.static(CLIENT_BUILD_PATH)); // Define static files location

app.get("/get", async (request, response) => {
  // construct a MongoClient object, passing in additional options
  let mongoClient = new MongoClient(URL, { useUnifiedTopology: true });

  try {
    await mongoClient.connect();
    // get reference to database via name
    let db = mongoClient.db(DB_NAME);
    let techArray = await db
      .collection("technologies")
      .find()
      .sort("name", 1)
      .toArray();
    let json = { technologies: techArray };

    response.statusCode = 200; // OK
    response.send(json); // send response
  } catch (error) {
    response.statusCode = 500; // Internal Server Error
    response.send({ error: error.message }); // send error
    console.log(`>>> ERROR : ${error.message}`);
  } finally {
    mongoClient.close();
  }
});

app.post("/post", async (request, response) => {
  let mongoClient = new MongoClient(URL, { useUnifiedTopology: true }); // Construct mongo client

  try {
    await mongoClient.connect();

    // sanitize form input
    request.body.name = request.sanitize(request.body.name);
    request.body.description = request.sanitize(request.body.description);
    request.body.difficulty = request.sanitize(request.body.difficulty);
    request.body.courses.forEach((course) => {
      course.code = request.sanitize(course.code);
      course.name = request.sanitize(course.name);
    });
    const techCollection = mongoClient.db(DB_NAME).collection("technologies"); // Get reference to technologies collection
    const result = await techCollection.insertOne(request.body); // Insert new tech into collection

    response.statusCode = 200; // OK
    response.send(result); // send response
  } catch (error) {
    response.statusCode = 500; // Internal Server Error
    response.send({ error: error.message }); // send error
    console.log(`>>> ERROR : ${error.message}`);
  } finally {
    mongoClient.close();
  }
});

app.put("/put/:id", async (request, response) => {
  let mongoClient = new MongoClient(URL, { useUnifiedTopology: true }); // Construct mongo client

  // get the route param, sanitize the input, convert to ObjectId
  const id = await new ObjectId(request.sanitize(request.params.id));

  try {
    await mongoClient.connect();

    // sanitize form input
    request.body.name = request.sanitize(request.body.name);
    request.body.description = request.sanitize(request.body.description);
    request.body.difficulty = request.sanitize(request.body.difficulty);
    request.body.courses.forEach((course) => {
      course.code = request.sanitize(course.code);
      course.name = request.sanitize(course.name);
    });
    const techCollection = mongoClient.db(DB_NAME).collection("technologies"); // Get reference to technologies collection
    const selector = { _id: id }; // Selector for update
    const newValue = { $set: request.body }; // New value for update
    const result = await techCollection.updateOne(selector, newValue); // Update tech in collection

    if (result.matchedCount <= 0) {
      response.statusCode = 404; // Not Found
      response.send({ error: "Not Found" }); // send error
      mongoClient.close();
      return;
    }

    response.statusCode = 200; // OK
    response.send(result); // send response
  } catch (error) {
    response.statusCode = 500; // Internal Server Error
    response.send({ error: error.message }); // send error
    console.log(`>>> ERROR : ${error.message}`);
  } finally {
    mongoClient.close();
  }
});

app.delete("/delete", async (req, res) => {
  const mongoClient = new MongoClient(URL, { useUnifiedTopology: true }); // Construct mongo client
  try {
    await mongoClient.connect();

    req.body.id = req.sanitize(req.body.id);
    const techCollection = mongoClient.db(DB_NAME).collection("technologies");
    const selector = { _id: new ObjectId(req.body.id) };
    const result = await techCollection.deleteOne(selector);

    if (result.deletedCount <= 0) {
      res.statusCode = 404; // Not Found
      res.send({ error: "Not Found" }); // send error
      return;
    }

    res.statusCode = 200; // OK
    res.send(result); // send response
  } catch (error) {
    res.statusCode = 500; // Internal Server Error
    res.send({ error: error.message }); // send error
    console.log(`>>> ERROR : ${error.message}`);
  } finally {
    mongoClient.close();
  }
});

// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
  response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

app.listen(8080, () => console.log("Listening on port 8080"));
