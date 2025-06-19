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
const filter_results_1 = require("./filter-results");
const match_user_1 = require("./match-user");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, add_user_1.addUser)({
            id: "u1",
            username: "kai",
            games: ["valorant", "lol"],
            honor: 80,
        });
        yield (0, add_user_1.addUser)({
            id: "u2",
            username: "lucy",
            games: ["minecraft", "apex"],
            honor: 85,
        });
        // Match a new user
        const rawMatches = yield (0, match_user_1.matchUser)({
            username: "ghost",
            games: ["wow", "cs2"],
            honor: 65,
        });
        // @ts-ignore
        const filtered = (0, filter_results_1.filterByOverlap)(["valorant", "cs2"], rawMatches, 70);
        console.log("🔍 Best matches:", filtered.map((m) => [m.id, m.metadata]));
    });
}
run();
