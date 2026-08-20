

const mongoose = require('mongoose');

const knowledgeChunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sourceFile: {
    type: String,   // e.g. "web-development-path.md" — kis file se aaya
    required: true
  },
  embedding: {
    type: [Number],  // ye array of numbers hoga — jaise [0.02, -0.13, 0.44, ...]
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeChunk', knowledgeChunkSchema);