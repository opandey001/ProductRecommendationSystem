const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
var axios = require("axios");
var headers = {
  accept: "text/plain",
};

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
// Your data (this could come from a database)

// In-memory database for simplicity (use a real database in production)
const users = [];

const data = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 20 },
  { id: 3, name: "Item 3", price: 30 },
];

// // Serve the HTML file
// app.get("/", (req, res) => {
//   res.render("grid", { data });
// });
// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

// Serve the registration form
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

// Handle form submissions
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Store user data in the in-memory database
  users.push({ username, password });
  res.render("grid", { data });
});

// Route to handle search logic
app.get("/RecientlyViewRecommendations", async (req, res) => {
  try {
    const response = await RecientlyViewRecommendations();
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
    const productId = req.params.productId.toLowerCase();
    const response = await GetSimmilarItems(productId);
    const data = response.data;
    console.log("SimilarItems--" + data[0].primaryProductId);
    res.json({ results: data });
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
});

async function GetSimmilarItems(productId) {
  var data = "";
  return await axios.get(
    "http://localhost:35867/Movie/SimilarItemRecommendations",
    {
      params: {
        userId: "1001",
        productId: productId,
      },
      headers: {
        accept: "text/plain",
      },
    }
  );
}

async function RecientlyViewRecommendations() {
  var data = "";
  return await axios.get(
    "http://localhost:35867/Movie/RecientlyViewRecommendations",
    {
      params: {
        userId: "1001",
        pageSize: "40",
      },
      headers: {
        accept: "text/plain",
      },
    }
  );
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
