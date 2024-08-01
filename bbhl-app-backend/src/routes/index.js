import { scheduleRoute } from "./schedule.js";
import { resultsRoute } from "./results.js";
import { playerStatsRoute } from "./playerStats.js";
import { playerRoute } from "./player.js";
import { standingsRoute } from "./standings.js";
import { teamRoute } from "./team.js";
import { homeRoute } from "./home.js";
import { bbhldokuRoute } from "./bbhldoku.js";
import { bbhldokuAnswerRoute } from "./bbhldoku-answer.js";
import { adminRoute } from "./admin.js";
import { adminPlayerStatsRoute } from "./admin-player-stats.js";
import { adminTeamStatsRoute } from "./admin-team-stats.js";
import { newGameRoute } from "./newGame.js";
import { draftSimRoute } from "./draftSim.js";
import { blackjackRoute } from "./blackjack.js";


export default [
    scheduleRoute,
    resultsRoute,
    standingsRoute,
    playerRoute,
    playerStatsRoute,
    teamRoute,
    homeRoute,
    bbhldokuRoute,
    bbhldokuAnswerRoute,
    adminRoute,
    adminPlayerStatsRoute,
    adminTeamStatsRoute,
    newGameRoute,
    draftSimRoute,
    blackjackRoute,
]