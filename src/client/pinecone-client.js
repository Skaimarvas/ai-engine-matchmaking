"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = exports.pinecone = void 0;
exports.deleteAllVectors = deleteAllVectors;
exports.checkPineconeConnection = checkPineconeConnection;
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
    throw new Error("Missing required environment variables.");
}
exports.pinecone = new pinecone_1.Pinecone({ apiKey: PINECONE_API_KEY });
exports.index = exports.pinecone.Index(PINECONE_INDEX_NAME);
function deleteAllVectors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vectorsExist = yield hasVectors();
            if (!vectorsExist) {
                console.log("No vectors to delete.");
                return;
            }
            console.log("Deleting all vectors...");
            yield exports.index.deleteAll();
            console.log("All vectors deleted.");
        }
        catch (error) {
            console.error("Failed to delete vectors:", error);
            throw error;
        }
    });
}
function checkPineconeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { indexes } = yield exports.pinecone.listIndexes();
            if (indexes && indexes.length === 0) {
                throw new Error("No Pinecone indexes found.");
            }
            return true;
        }
        catch (error) {
            console.error("Pinecone connection failed:", error);
            return false;
        }
    });
}
function hasVectors() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stats = yield exports.index.describeIndexStats();
            const isRecordExist = stats.totalRecordCount && stats.totalRecordCount > 0;
            return !!isRecordExist;
        }
        catch (error) {
            console.error("Error checking vector stats:", error);
            throw error;
        }
    });
}
