const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config();
const app = express();
var axios = require("axios");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
var users = [];
// Serve the HTML file
app.get("/", (req, res) => {
  users = [];
  res.sendFile(__dirname + "/register.html");
});

// Serve the registration form
app.get("/register", (req, res) => {
  users = [];
  res.sendFile(__dirname + "/register.html");
});

// Handle form submissions
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Store user data in the in-memory database
  users.push({ username, password });
  res.render("grid");
});

// Route to handle search logic
app.get("/RecientlyViewRecommendations", async (req, res) => {
  try {
    console.log("users list" + users[0].username);
    let userId =
      users.length > 0 ? users[0].username : process.env.DEFAULT_PRODUCT_ID;
    const response = await RecientlyViewRecommendations(userId);
    // Capture the data from the response into a variable
    const data = response.data;

    res.json({ results: data });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
});

// Route to handle search logic
app.get("/SimilarItems/:productId", async (req, res) => {
  try {
    let userId =
      users.length > 0 ? users[0].username : process.env.DEFAULT_PRODUCT_ID;
    const productId = req.params.productId.toLowerCase();
    const response = await GetSimmilarItems(productId, userId);
    const data = response.data;
    console.log("SimilarItems--" + data[0].primaryProductId);
    res.json({ results: data });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
});

async function GetSimmilarItems(productId, userId) {
  var data = "";
  return await axios.get(process.env.SIMILAR_API_URL, {
    params: {
      userId: userId,
      productId: productId,
    },
    headers: {
      accept: "text/plain",
    },
  });
}

async function RecientlyViewRecommendations(userId) {
  var data = "";
  return await axios.get(process.env.RECENT_API_URL, {
    params: {
      userId: userId,
      pageSize: "10",
    },
    headers: {
      accept: "text/plain",
    },
  });
}

// Start the server
app.listen(5000, () => {
  console.log(`Server is running on http://localhost:${5000}`);
});
