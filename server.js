const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const clientRoutes = require("./routes/clients");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve the frontend from the public folder
app.use(express.static("public"));

app.use("/api/clients", clientRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
