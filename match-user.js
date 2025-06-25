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
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchUser = matchUser;
const pinecone_client_1 = require("./client/pinecone-client");
const embed_user_1 = require("./embed-user");
function matchUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const vector = yield (0, embed_user_1.embedUserProfile)(user);
        const res = yield pinecone_client_1.index.query({
            vector,
            topK: 5,
            includeMetadata: true,
            filter: {
                honor_rating: { $gte: user.honor_rating },
            },
        });
        return res.matches;
    });
}
