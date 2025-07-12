import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
export async function deleteAllVectors() {
  // Adjust index name as needed
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
  
  // Delete all vectors (wildcard)
  await index.deleteAll();
}

export async function checkPineconeConnection() {
  try {
    await index.describeIndexStats();
    return true;
  } catch (err) {
    console.error("❌ Pinecone connection failed:", err);
    return false;
  }
}
export const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
