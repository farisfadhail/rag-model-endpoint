const multer = require("multer");
const fs = require("fs");
const path = require("path");
const documents = require("../services/documentsStore.js");
const { askMistral } = require("../services/mistralService.js");
const findMostRelevant = require("../services/mistralEmbedding.js");

const upload = multer({ dest: "./docs/" });

exports.ingestDocument = [
	upload.single("file"),
	async (req, res) => {
		try {
			const docsPath = path.join(__dirname, "../docs");

			if (!fs.existsSync(docsPath)) {
				fs.mkdirSync(docsPath);
			}

			const file = req.file;

			if (file) {
				if (file.mimetype !== "text/plain") {
					return res.status(400).json({ error: "Only .txt files are allowed" });
				}

				const originalName = file.originalname;
				const tempPath = file.path;
				const finalPath = path.join(docsPath, originalName);

				let content = fs.readFileSync(tempPath, "utf8").toLowerCase();
				content = content.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");

				fs.writeFileSync(finalPath, content, "utf8");
				fs.unlinkSync(tempPath);
			}

			if (!fs.existsSync(docsPath)) {
				return res.status(400).json({ error: "'docs' folder not found." });
			}

			const files = fs.readdirSync(docsPath);

			documents.length = 0;

			files.forEach((file) => {
				if (file.endsWith(".txt")) {
					const content = fs.readFileSync(path.join(docsPath, file), "utf8");
					documents.push({ id: file, text: content });
				}
			});

			res.json({
				status: "ok",
				inserted: file ? 1 : 0,
				ingested: documents.length,
				files: documents.map((d) => d.id),
			});
		} catch (err) {
			res.status(500).json({ error: err.message });
		}
	},
];

function ensureDocumentsLoaded() {
	if (documents.length === 0) {
		throw new Error("No documents loaded. Please ingest or upload first.");
	}
}

exports.retrieveContext = async (req, res) => {
	try {
		const { question } = req.body;
		if (!question) {
			return res.status(400).json({ error: "Question is required." });
		}

		ensureDocumentsLoaded();
		const relevant = findMostRelevant(question, documents);

		if (relevant.length === 0) {
			return res.status(200).json({ context: [], message: "No relevant context found." });
		}

		const context = relevant.map((doc) => doc.text);
		res.json({ context, matched: relevant.map((doc) => doc.id) });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

exports.generateAnswer = async (req, res) => {
	try {
		const { question } = req.body;
		if (!question) {
			return res.status(400).json({ error: "Question is required." });
		}

		ensureDocumentsLoaded();
		const relevant = findMostRelevant(question, documents);

		if (relevant.length === 0) {
			return res.status(200).json({ answer: "Sorry, I couldn't find any relevant context.", context: [] });
		}

		const context = relevant.map((doc) => doc.text);
		const prompt = `Context:\n${context.join("\n\n")}\n\nQuestion: ${question}`;
		const answer = await askMistral(prompt);

		res.json({ answer, context: relevant.map((r) => r.id) });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
