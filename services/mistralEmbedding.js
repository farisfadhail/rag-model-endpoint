const natural = require("natural");
const { removeStopwords, ind } = require("stopword");
const sastrawijs = require("sastrawijs");
const tokenizer = new natural.WordTokenizer();

function stem(text) {
	const stemmer = new sastrawijs.Stemmer();
	return stemmer.stem(text);
}

function preprocess(text) {
	let tokens = tokenizer.tokenize(text.toLowerCase());

	tokens = removeStopwords(tokens, ind);

	tokens = tokens.map((token) => stem(token));

	tokens = tokens.filter((token) => /^[a-z0-9]+$/.test(token));

	return tokens;
}

function jaccardSimilarity(text1, text2) {
	const words1 = new Set(preprocess(text1));
	const words2 = new Set(preprocess(text2));

	const intersection = new Set([...words1].filter((w) => words2.has(w)));
	const union = new Set([...words1, ...words2]);

	return intersection.size / union.size;
}

function findMostRelevant(question, docs, topK = 3, threshold = 0.01) {
	const scoredDocs = docs.map((doc) => {
		const score = jaccardSimilarity(doc.text, question);
		console.log(`Doc: ${doc.id}, Score: ${score}`);
		return { ...doc, score };
	});

	return scoredDocs
		.sort((a, b) => b.score - a.score)
		.slice(0, topK)
		.filter((doc) => doc.score >= threshold);
}

module.exports = findMostRelevant;
