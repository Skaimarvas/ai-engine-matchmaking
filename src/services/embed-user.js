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
exports.embedUserProfile = embedUserProfile;
const openai_client_1 = require("../client/openai-client");
function embedUserProfile(profile) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = `
  Games: ${profile.games.join(", ")},
  Availability: ${profile.availability.join(", ")},
  Play Style: ${profile.play_style.join(", ")},
  Honor: ${profile.honor_rating}, 
  Bio: ${profile.bio} `;
        const res = yield openai_client_1.openai.embeddings.create({
            model: "text-embedding-3-small",
            input,
        });
        return res.data[0].embedding;
    });
}
