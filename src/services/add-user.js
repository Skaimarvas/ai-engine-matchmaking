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
exports.addUser = addUser;
const pinecone_client_1 = require("../client/pinecone-client");
const embed_user_1 = require("./embed-user");
function addUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const vector = yield (0, embed_user_1.embedUserProfile)(user);
        yield pinecone_client_1.index.upsert([
            {
                id: user.id,
                values: vector,
                metadata: {
                    username: user.username,
                    games: user.games.join(", "),
                    availability: user.availability.join(", "),
                    play_style: user.play_style.join(", "),
                    honor_rating: user.honor_rating,
                    bio: user.bio,
                },
            },
        ]);
        console.log(`✅ User ${user.username} added to Pinecone`);
    });
}
