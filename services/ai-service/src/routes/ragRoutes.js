const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const KnowledgeChunk = require("../models/knowledge-chunk");
const cosineSimilarity = require("../utils/similarity");

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model for creating embeddings
const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

// Model for generating the final answer
const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

// POST /api/ai/ask
router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    // 1. Validate question
    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("\nUser question:", question);

    // 2. Generate embedding for user's question
    console.log("Generating question embedding...");

    const embeddingResult = await embeddingModel.embedContent(question);

    const questionEmbedding = embeddingResult.embedding.values;

    console.log("Question embedding generated.");

    // 3. Get all knowledge chunks from MongoDB
    const knowledgeChunks = await KnowledgeChunk.find();

    console.log(
      `Found ${knowledgeChunks.length} knowledge chunks in database.`,
    );

    // 4. Calculate similarity for every chunk
    const scoredChunks = knowledgeChunks.map((chunk) => {
      const score = cosineSimilarity(questionEmbedding, chunk.embedding);

      return {
        text: chunk.text,
        sourceFile: chunk.sourceFile,
        score,
      };
    });

    // 5. Sort chunks from most relevant to least relevant
    scoredChunks.sort((a, b) => b.score - a.score);

    // 6. Select top 3 relevant chunks
    const topChunks = scoredChunks.slice(0, 3);

    console.log("\nTop relevant chunks:");

    topChunks.forEach((chunk, index) => {
      console.log(`${index + 1}. ${chunk.sourceFile} → ${chunk.score}`);
    });

    // 7. Create context from selected chunks
    const context = topChunks
      .map((chunk) => {
        return `
Source: ${chunk.sourceFile}

${chunk.text}
`;
      })
      .join("\n--------------------\n");

    // 8. Send context + question to Gemini
    console.log("\nGenerating AI answer...");

    const prompt = `
You are SkillForge's AI career assistant.

Answer the user's question using the provided knowledge base.

IMPORTANT RULES:
- Use the knowledge base as your primary source.
- Do not make up information that is not supported by the context.
- If the knowledge base does not contain enough information, clearly say that.
- Give a helpful and easy-to-understand answer.
- Do not mention embeddings, cosine similarity, or internal RAG implementation.

KNOWLEDGE BASE:
${context}

USER QUESTION:
${question}

ANSWER:
`;

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    // 9. Return response
    return res.status(200).json({
      success: true,
      question,
      answer,
      sources: topChunks.map((chunk) => ({
        file: chunk.sourceFile,
        similarity: chunk.score,
      })),
    });
  } catch (error) {
    console.error("RAG request failed:");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to process your question",
      error: error.message,
    });
  }
});

module.exports = router;
