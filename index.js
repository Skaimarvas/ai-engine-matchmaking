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
const add_user_1 = require("./add-user");
const mock_data_1 = require("./libs/data/mock-data");
const match_user_1 = require("./match-user");
const rerank_matches_1 = require("./rerank-matches");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const addUsers = () => __awaiter(this, void 0, void 0, function* () {
            return Promise.all(mock_data_1.matchesArray.map((user) => (0, add_user_1.addUser)(user)));
        });
        yield addUsers();
        const rawMatches = yield (0, match_user_1.matchUser)(mock_data_1.player);
        const ranked = yield (0, rerank_matches_1.rerankMatches)(mock_data_1.player, rawMatches);
        console.log("🧠 GPT-Ranked Matches:");
        ranked.forEach((m, i) => console.log(`${i + 1}. ${m.username} — ${m.reason}`));
    });
}
run();
