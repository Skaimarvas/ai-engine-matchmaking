import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  throw new Error("Missing required environment variables.");
}

export const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
export const index = pinecone.Index(PINECONE_INDEX_NAME);

export async function deleteAllVectors(): Promise<void> {
  try {
    const vectorsExist = await hasVectors();
    if (!vectorsExist) {
      console.log("No vectors to delete.");
      return;
    }

    console.log("Deleting all vectors...");
    await index.deleteAll();
    console.log("All vectors deleted.");
  } catch (error) {
    console.error("Failed to delete vectors:", error);
    throw error;
  }
}

export async function checkPineconeConnection(): Promise<boolean> {
  try {
    const { indexes } = await pinecone.listIndexes();
    if (indexes && indexes.length === 0) {
      throw new Error("No Pinecone indexes found.");
    }
    return true;
  } catch (error) {
    console.error("Pinecone connection failed:", error);
    return false;
  }
}

async function hasVectors(): Promise<boolean> {
  try {
    const stats = await index.describeIndexStats();
    const isRecordExist = stats.totalRecordCount && stats.totalRecordCount > 0
    return !!isRecordExist;
  } catch (error) {
    console.error("Error checking vector stats:", error);
    throw error;
  }
}