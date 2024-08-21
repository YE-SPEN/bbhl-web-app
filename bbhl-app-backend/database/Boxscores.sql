CREATE TABLE boxscores (
    game_id VARCHAR(8),
    player VARCHAR(90),
    goals INT(3),
    assists INT(3),
    points INT(3),
    pims INT(3),
    gwg INT(3),
    PRIMARY KEY (game_id, player),
    FOREIGN KEY (game_id) REFERENCES schedule(game_id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER "boxscores_AFTER_INSERT" AFTER INSERT ON "boxscores" FOR EACH ROW BEGIN
    DECLARE year INT;

    SELECT season INTO year
    FROM schedule
    WHERE game_id = NEW.game_id;

    UPDATE player_stats
    SET 
        games_played = games_played + 1,
        goals = goals + NEW.goals,
        assists = assists + NEW.assists,
        points = points + NEW.points,
        pims = pims + NEW.pims,
        gwg = gwg + NEW.gwg
    WHERE 
        name = NEW.player
        AND season = year;

END //

DELIMITER ;