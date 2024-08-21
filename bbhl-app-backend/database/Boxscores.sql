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