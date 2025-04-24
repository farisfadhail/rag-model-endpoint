const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "RAG API is running" });
});

const ragRoutes = require("./routes/rag");
app.use("/api/rag", ragRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`RAG API running on http://localhost:${PORT}`);
});
