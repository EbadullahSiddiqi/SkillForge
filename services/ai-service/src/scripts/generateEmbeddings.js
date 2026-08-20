const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const KnowledgeChunk = require("../models/knowledge-chunk");

const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
  model: "gemini-embedding-001",
});

const knowledgeBasePath = path.join(__dirname, "../knowledge-base");

function splitIntoChunks(text, chunkSize = 500) {
  const words = text.split(/\s+/);

  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");

    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

async function generateEmbedding(text) {
  const result = await embeddingModel.embedContent(text);

  return result.embedding.values;
}

async function generateEmbeddings() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connected.");

    const files = fs
      .readdirSync(knowledgeBasePath)
      .filter((file) => file.endsWith(".md"));

    console.log(`Found ${files.length} knowledge-base files.`);

    // Remove old chunks so we don't create duplicates
    await KnowledgeChunk.deleteMany({});

    console.log("Old knowledge chunks deleted.");

    let totalChunks = 0;

    for (const file of files) {
      console.log(`\nProcessing: ${file}`);

      const filePath = path.join(knowledgeBasePath, file);

      const text = fs.readFileSync(filePath, "utf-8");

      const chunks = splitIntoChunks(text);

      console.log(`Created ${chunks.length} chunks.`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        console.log(
          `Generating embedding ${i + 1}/${chunks.length}...`
        );

        const embedding = await generateEmbedding(chunk);

        await KnowledgeChunk.create({
          text: chunk,
          sourceFile: file,
          embedding: embedding,
        });

        totalChunks++;

        console.log("Chunk saved.");
      }
    }

    console.log("\n================================");
    console.log("Embedding generation completed!");
    console.log(`Total chunks saved: ${totalChunks}`);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("\nEmbedding generation failed:");
    console.error(error);

    process.exit(1);
  }
}

generateEmbeddings();