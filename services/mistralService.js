const { Mistral } = require("@mistralai/mistralai");
const dotenv = require("dotenv");
dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

async function askMistral(prompt) {
	const chatResponse = await client.chat.complete({
		model: "mistral-large-latest",
		messages: [{ role: "user", content: prompt }],
	});

	return chatResponse.choices[0].message.content;
}

module.exports = { askMistral };
