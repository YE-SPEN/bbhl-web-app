CREATE TABLE goalie_boxscores (
    game_id VARCHAR(8),
    player VARCHAR(90),
    wins INT(3),
    losses INT(3),
    ties INT(3),
    goals_against INT(3),
    shots_against INT(3),
    saves INT(3),
    shutouts INT(3),
    PRIMARY KEY (game_id, player),
    FOREIGN KEY (game_id) REFERENCES schedule(game_id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER "goalie_boxscores_AFTER_INSERT" AFTER INSERT ON "goalie_boxscores" FOR EACH ROW BEGIN
    DECLARE year INT;

        SELECT season INTO year
        FROM schedule
        WHERE game_id = NEW.game_id;

        UPDATE goalie_stats
        SET 
            games_played = games_played + 1,
            wins = wins + NEW.wins,
            losses = losses + NEW.losses,
            ties = ties + NEW.ties,
            goals_against = goals_against + NEW.goals_against,
            shots_against = shots_against + NEW.shots_against,
            saves = saves + NEW.saves,
            shutouts = shutouts + NEW.shutouts,
            gaa = ROUND(goals_against / games_played, 2),
            sv_percentage = ROUND(saves / shots_against, 3)
        WHERE 
            name = NEW.player
            AND season = year;
END //

DELIMITER ;