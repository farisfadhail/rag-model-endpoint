const express = require("express");
const router = express.Router();
const { ingestDocument, generateAnswer, retrieveContext } = require("../controllers/ragController");

router.get("/", (req, res) => {
	res.json({ message: "RAG API is running" });
});

router.post("/ingest", ingestDocument);
router.post("/generate", generateAnswer);
router.post("/retrieve", retrieveContext);

module.exports = router;
