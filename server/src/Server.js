let express = require("express");
let cors = require("cors");
let path = require("path");
let sanitize = require("express-sanitizer");
let MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectId;

// MongoDB constants
const DB_URL = "mongodb://mongo:27017/";
const DB_NAME = "dbData";

// construct application object via express
let app = express();

app.use(cors()); // Cors Middleware // TODO: remove this line when deploying
app.use(express.json()); // for parsing application/json
app.use(sanitize()); // sanitize request body

const courseExists = async (code, name) => {
  const client = new MongoClient(DB_URL, { useNewUrlParser: true });

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    if (await db.collection("courses").findOne({ code, name })) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(`>>> Error in courseExists: ${error}`);
  } finally {
    client.close();
  }
};

// const updateCourse = async (id, newCode, newName) => {
//   const client = new MongoClient(DB_URL, { useUnifiedTopology: true });
//   const courses =
// }

const CLIENT_BUILD_PATH = path.join(__dirname, "./../../client/build"); // Get absolute path to client/build

app.use("/", express.static(CLIENT_BUILD_PATH)); // Define static files location

app.get("/get", async (request, response) => {
  // construct a MongoClient object, passing in additional options
  let mongoClient = new MongoClient(DB_URL, { useUnifiedTopology: true });

  try {
    await mongoClient.connect();
    // get reference to database via name
    let db = mongoClient.db(DB_NAME);
    let techArray = await db
      .collection("technologies")
      .find()
      .sort("name", 1)
      .toArray();
    const courseArray = await db
      .collection("courses")
      .find()
      .sort("name", 1)
      .toArray();
    let json = {
      technologies: techArray,
      courses: courseArray,
    };

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

app.post("/course", async (req, res) => {
  const mongoClient = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body.code = req.sanitize(req.body.code);
  req.body.name = req.sanitize(req.body.name);

  const course = {
    code: req.body.code,
    name: req.body.name,
  };

  if (await courseExists(course.code, course.name)) {
    res.statusCode = 400;
    res.send({ error: "Course already exists" });
    return;
  }

  try {
    await mongoClient.connect();
    const db = mongoClient.db(DB_NAME);
    const result = await db.collection("courses").insertOne(course);

    res.statusCode = 200;
    res.send(result);
    return;
  } catch (error) {
    res.statusCode = 500;
    res.send({ error: error.message });
    console.log(`>>> ERROR : ${error.message}`);
  } finally {
    mongoClient.close();
  }
});

app.post("/tech", async (req, res) => {
  const client = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body.name = req.sanitize(req.body.name);
  req.body.description = req.sanitize(req.body.description);
  req.body.difficulty = req.sanitize(req.body.difficulty);

  req.body.courses.forEach((course) => {
    course.code = req.sanitize(course.code);
    course.name = req.sanitize(course.name);

    const test = courseExists(course.code, course.name);

    if (!test) {
      res.statusCode = 400;
      res.send({ error: "Course does not exist" });
      return;
    }
  });
  try {
    await client.connect();
    const techCollection = client.db(DB_NAME).collection("technologies");
    const result = await techCollection.insertOne(req.body);

    res.statusCode = 200;
    res.send(result);
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    res.statusCode = 500;
    res.send({ error: error.message });
  } finally {
    client.close();
  }
});

app.delete("/course", async (req, res) => {
  const client = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body._id = req.sanitize(req.body._id);

  const _id = new ObjectId(req.body._id);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const techs = await db.collection("technologies");
    const courses = await db.collection("courses");

    const course = await courses.findOne({ _id });
    const courseResult = await courses.deleteOne({ _id });

    if (courseResult.deletedCount === 0) {
      res.statusCode = 404;
      res.send({ error: "Course does not exist" });
      return;
    }
    const techResult = await techs.updateMany(
      {},
      { $pull: { courses: { code: course.code, name: course.name } } }
    );

    res.statusCode = 200;
    res.send({
      course: courseResult,
      techs: techResult,
    });
  } finally {
    client.close();
  }
});

app.delete("/tech", async (req, res) => {
  const client = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body._id = req.sanitize(req.body._id);
  const _id = new ObjectId(req.body._id);

  try {
    await client.connect();
    const techs = client.db(DB_NAME).collection("technologies");
    const result = await techs.deleteOne({ _id });

    if (result.deletedCount === 0) {
      res.statusCode = 404; // Not Found
      res.send({ error: "Technology does not exist" });
      return;
    }

    res.statusCode = 200;
    res.send(result);
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    res.statusCode = 500;
    res.send({ error: error.message });
  } finally {
    client.close();
  }
});

app.put("/course", async (req, res) => {
  const client = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body._id = req.sanitize(req.body._id);
  req.body.name = req.sanitize(req.body.name);
  const _id = new ObjectId(req.body._id);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const techs = db.collection("technologies");
    const courses = db.collection("courses");

    const course = await courses.findOne({ _id }); // get course
    if (!course) {
      res.statusCode = 404; // Not Found
      res.send({ error: "Course does not exist" });
      return;
    }
    console.log(course);
    console.log(req.body);

    const techResult = await techs.updateMany(
      {
        courses: {
          $elemMatch: {
            code: course.code,
            name: course.name,
          },
        },
      },
      {
        $set: {
          "courses.$.name": req.body.name,
        },
      }
    );

    const courseResult = await courses.updateOne(
      { _id },
      {
        $set: {
          name: req.body.name,
        },
      }
    );

    res.statusCode = 200;
    res.send({
      course: courseResult,
      techs: techResult,
    });
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    res.statusCode = 500;
  } finally {
    client.close();
  }
});

app.put("/tech", async (req, res) => {
  const client = new MongoClient(DB_URL, { useUnifiedTopology: true });

  req.body._id = req.sanitize(req.body._id);
  req.body.name = req.sanitize(req.body.name);
  req.body.description = req.sanitize(req.body.description);
  req.body.difficulty = req.sanitize(req.body.difficulty);

  req.body.courses.forEach((course) => {
    course.code = req.sanitize(course.code);
    course.name = req.sanitize(course.name);

    const courseValid = courseExists(course.code, course.name);
    if (!courseValid) {
      res.statusCode = 400;
      res.send({ error: "Course does not exist" });
      return;
    }
  });

  const _id = new ObjectId(req.body._id);

  try {
    await client.connect();

    const tech = client.db(DB_NAME).collection("technologies");
    const result = await tech.updateOne(
      { _id },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          difficulty: req.body.difficulty,
          courses: req.body.courses,
        },
      }
    );

    if (result.matchedCount === 0) {
      res.statusCode = 404; // Not Found
      res.send({ error: "Technology does not exist" });
      return;
    }

    res.statusCode = 200;
    res.send(result);
  } catch (error) {
    console.log(`>>> ERROR : ${error.message}`);
    res.statusCode = 500;
    res.send({ error: error.message });
  } finally {
    client.close();
  }
});

app.put("/put/:id", async (request, response) => {
  let mongoClient = new MongoClient(DB_URL, { useUnifiedTopology: true }); // Construct mongo client

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

// wildcard to handle all other non-api URL routings and point to index.html
app.use((request, response) => {
  response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

app.listen(80, () => console.log("Listening on port 80"));
