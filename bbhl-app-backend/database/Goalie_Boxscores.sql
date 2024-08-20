CREATE TABLE goalie_boxscores (
    game_id VARCHAR(8),
    player VARCHAR(90),
    wins INT(3),
    losses INT(3),
    ties INT(3),
    goals_against INT(3),
    shots_against INT(3),
    saves INT(3),
    shutouts: INT(3),
    PRIMARY KEY (game_id, player),
    FOREIGN KEY (game_id) REFERENCES schedule(game_id)
);