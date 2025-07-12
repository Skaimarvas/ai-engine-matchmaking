"use strict";
// ai-engine/rerankMatches.ts
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
exports.rerankMatches = rerankMatches;
const openai_client_1 = require("../client/openai-client");
function rerankMatches(user, matches) {
    return __awaiter(this, void 0, void 0, function* () {
        const userProfile = `
User:
  - Username: ${user.username},
  - Games: ${user.games.join(", ")},
  - Availability: ${user.availability.join(", ")},
  - Play Style: ${user.play_style.join(", ")},
  - Honor: ${user.honor_rating},
  - Bio: ${user.bio}
`;
        const candidates = matches
            .map((m, i) => {
            var _a, _b, _c, _d, _e, _f;
            return `
Candidate ${i + 1}:
  - Id: ${m.id}
  - Username: ${(_a = m.metadata) === null || _a === void 0 ? void 0 : _a.username},
  - Games: ${(_b = m.metadata) === null || _b === void 0 ? void 0 : _b.games},
  - Availability: ${(_c = m.metadata) === null || _c === void 0 ? void 0 : _c.availability},
  - Play Style: ${(_d = m.metadata) === null || _d === void 0 ? void 0 : _d.play_style},
  - Honor: ${(_e = m.metadata) === null || _e === void 0 ? void 0 : _e.honor_rating},
  - Bio: ${(_f = m.metadata) === null || _f === void 0 ? void 0 : _f.bio}
`;
        })
            .join("\n");
        const prompt = `
You are an intelligent matchmaking assistant for gamers.

Given the following player and potential matches, rank the top 3 best matches and explain your reasoning to the user using second-person language kindly. in 1 sentence per match. Here is a rule: 
- If no candidate, user, or possible match is found, return an object with a status code of 404. The object should also include a message explaining the reason for the 404 status — specifically, that no relevant data was found and Return JSON in this format:
  { status: 404, message: "..."}

${userProfile}

${candidates}

Return JSON in this format:
[
  { "id": "u1", "username": "lucy", "reason": "They both like FPS and have high honor" },
  ...
]
`;
        const response = yield openai_client_1.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        });
        const json = extractJSONFromResponse(response.choices[0].message.content);
        return json;
    });
}
function extractJSONFromResponse(text) {
    try {
        // Try to find array
        const jsonStartArr = text.indexOf("[");
        const jsonEndArr = text.lastIndexOf("]");
        if (jsonStartArr !== -1 && jsonEndArr !== -1) {
            const json = text.slice(jsonStartArr, jsonEndArr + 1);
            return JSON.parse(json);
        }
        // Try to find object
        const jsonStartObj = text.indexOf("{");
        const jsonEndObj = text.lastIndexOf("}");
        if (jsonStartObj !== -1 && jsonEndObj !== -1) {
            const json = text.slice(jsonStartObj, jsonEndObj + 1);
            return JSON.parse(json);
        }
        // Fallback
        throw new Error("No valid JSON found");
    }
    catch (e) {
        console.error("❌ Failed to parse GPT response:", text);
        return [];
    }
}
