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
exports.pinecone = new pinecone_1.Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});
function deleteAllVectors() {
    return __awaiter(this, void 0, void 0, function* () {
        // Adjust index name as needed
        const index = exports.pinecone.Index(process.env.PINECONE_INDEX_NAME);
        // Delete all vectors (wildcard)
        yield index.deleteAll();
    });
}
function checkPineconeConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.index.describeIndexStats(); // this is a lightweight, safe call
            return true;
        }
        catch (err) {
            console.error("❌ Pinecone connection failed:", err);
            return false;
        }
    });
}
exports.index = exports.pinecone.Index(process.env.PINECONE_INDEX_NAME);
