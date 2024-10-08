CREATE TABLE schedule (
    date DATE,
    time VARCHAR(10),
    game_id VARCHAR(8) PRIMARY KEY,
	home_team VARCHAR(30) REFERENCES Teams(team),
    home_score INT(2) DEFAULT 0,
    away_score INT(2) DEFAULT 0,
    away_team VARCHAR(30) REFERENCES Teams(team),
    season INT(4),
    status VARCHAR(10),
    hasBoxscore BOOLEAN DEFAULT FALSE
);

DELIMITER //

CREATE TRIGGER "schedule_AFTER_UPDATE" AFTER UPDATE ON "schedule" FOR EACH ROW BEGIN
    DECLARE home_team_won BOOLEAN;
    DECLARE away_team_won BOOLEAN;
    DECLARE tie_game BOOLEAN;

    IF OLD.status = 'scheduled' AND NEW.status = 'complete' THEN
        -- Determine the result of the game
        SET home_team_won = (NEW.home_score > NEW.away_score);
        SET away_team_won = (NEW.away_score > NEW.home_score);
        SET tie_game = (NEW.home_score = NEW.away_score);

        -- Update home team stats
        UPDATE team_stats
        SET 
            games_played = games_played + 1,
            wins = wins + IF(home_team_won, 1, 0),
            losses = losses + IF(away_team_won, 1, 0),
            ties = ties + IF(tie_game, 1, 0),
            points = points + IF(home_team_won, 2, IF(tie_game, 1, 0)),
            goals_for = goals_for + NEW.home_score,
            goals_against = goals_against + NEW.away_score,
            differential = differential + (NEW.home_score - NEW.away_score)
        WHERE team = NEW.home_team
        AND season = NEW.season;

        -- Update away team
        UPDATE team_stats
        SET 
            games_played = games_played + 1,
            wins = wins + IF(away_team_won, 1, 0),
            losses = losses + IF(home_team_won, 1, 0),
            ties = ties + IF(tie_game, 1, 0),
            points = points + IF(away_team_won, 2, IF(tie_game, 1, 0)),
            goals_for = goals_for + NEW.away_score,
            goals_against = goals_against + NEW.home_score,
            differential = differential + (NEW.away_score - NEW.home_score)
        WHERE team = NEW.away_team
        AND season = NEW.season;
    END IF;

END //

DELIMITER ;

INSERT INTO schedule (date, time, game_id, home_team, home_score, away_score, away_team, season, status) VALUES 
('2022-10-08', '4:00 PM', '4-100822', 'Ducks', '1', '5', 'Easy Company', '2023', 'complete'),
('2022-10-08', '6:00 PM', '6-100822', 'Punishers', '5', '3', 'P.C. United', '2023', 'complete'),
('2022-10-08', '5:00 PM', '5-100822', 'Blazers', '4', '2', 'The Irish', '2023', 'complete'),
('2022-10-15', '5:00 PM', '5-101522', 'Ducks', '2', '3', 'Blazers', '2023', 'complete'),
('2022-10-15', '4:00 PM', '4-101522', 'Blades of Steel', '1', '4', 'Punishers', '2023', 'complete'),
('2022-10-15', '6:00 PM', '6-101522', 'Easy Company', '6', '0', 'The Irish', '2023', 'complete'),
('2022-10-22', '4:00 PM', '4-102222', 'Easy Company', '3', '2', 'Blades of Steel', '2023', 'complete'),
('2022-10-22', '5:00 PM', '5-102222', 'Blazers', '4', '1', 'P.C. United', '2023', 'complete'),
('2022-10-22', '6:00 PM', '6-102222', 'Ducks', '6', '2', 'Punishers', '2023', 'complete'),
('2022-10-29', '6:00 PM', '6-102922', 'Blazers', '3', '2', 'Blades of Steel', '2023', 'complete'),
('2022-10-29', '4:00 PM', '4-102922', 'Easy Company', '1', '4', 'P.C. United', '2023', 'complete'),
('2022-10-29', '5:00 PM', '5-102922', 'Ducks', '2', '3', 'The Irish', '2023', 'complete'),
('2022-11-05', '4:00 PM', '4-110522', 'Ducks', '1', '1', 'P.C. United', '2023', 'complete'),
('2022-11-05', '5:00 PM', '5-110522', 'Easy Company', '3', '3', 'Punishers', '2023', 'complete'),
('2022-11-05', '6:00 PM', '6-110522', 'Blades of Steel', '3', '5', 'The Irish', '2023', 'complete'),
('2022-11-12', '6:00 PM', '6-111222', 'Blazers', '1', '0', 'Easy Company', '2023', 'complete'),
('2022-11-12', '4:00 PM', '4-111222', 'Blades of Steel', '5', '7', 'P.C. United', '2023', 'complete'),
('2022-11-12', '5:00 PM', '5-111222', 'The Irish', '0', '2', 'Punishers', '2023', 'complete'),
('2022-11-19', '5:00 PM', '5-111922', 'Ducks', '3', '3', 'Blades of Steel', '2023', 'complete'),
('2022-11-19', '6:00 PM', '6-111922', 'The Irish', '3', '4', 'P.C. United', '2023', 'complete'),
('2022-11-19', '4:00 PM', '4-111922', 'Blazers', '2', '6', 'Punishers', '2023', 'complete'),
('2022-11-26', '5:00 PM', '5-112622', 'Ducks', '4', '4', 'Easy Company', '2023', 'complete'),
('2022-11-26', '4:00 PM', '4-112622', 'Punishers', '2', '3', 'P.C. United', '2023', 'complete'),
('2022-11-26', '6:00 PM', '6-112622', 'Blazers', '6', '6', 'The Irish', '2023', 'complete'),
('2022-12-03', '5:00 PM', '5-120322', 'Ducks', '1', '5', 'Blazers', '2023', 'complete'),
('2022-12-03', '4:00 PM', '4-120322', 'Blades of Steel', '1', '2', 'Punishers', '2023', 'complete'),
('2022-12-03', '6:00 PM', '6-120322', 'Easy Company', '3', '3', 'The Irish', '2023', 'complete'),
('2022-12-10', '4:00 PM', '4-121022', 'Easy Company', '3', '6', 'Blades of Steel', '2023', 'complete'),
('2022-12-10', '6:00 PM', '6-121022', 'Blazers', '4', '3', 'P.C. United', '2023', 'complete'),
('2022-12-10', '5:00 PM', '5-121022', 'Ducks', '4', '3', 'Punishers', '2023', 'complete'),
('2022-12-17', '4:00 PM', '4-121722', 'Blazers', '4', '2', 'Blades of Steel', '2023', 'complete'),
('2022-12-17', '5:00 PM', '5-121722', 'Easy Company', '6', '4', 'P.C. United', '2023', 'complete'),
('2022-12-17', '6:00 PM', '6-121722', 'Ducks', '5', '0', 'The Irish', '2023', 'complete'),
('2023-01-07', '5:00 PM', '5-010723', 'Ducks', '5', '2', 'P.C. United', '2023', 'complete'),
('2023-01-07', '6:00 PM', '6-010723', 'Easy Company', '5', '5', 'Punishers', '2023', 'complete'),
('2023-01-07', '4:00 PM', '4-010723', 'Blades of Steel', '4', '8', 'The Irish', '2023', 'complete'),
('2023-01-14', '6:00 PM', '6-011423', 'Blazers', '0', '4', 'Easy Company', '2023', 'complete'),
('2023-01-14', '5:00 PM', '5-011423', 'Blades of Steel', '5', '1', 'P.C. United', '2023', 'complete'),
('2023-01-14', '4:00 PM', '4-011423', 'The Irish', '2', '2', 'Punishers', '2023', 'complete'),
('2023-01-21', '6:00 PM', '6-012123', 'Ducks', '5', '5', 'Blades of Steel', '2023', 'complete'),
('2023-01-21', '5:00 PM', '5-012123', 'The Irish', '5', '4', 'P.C. United', '2023', 'complete'),
('2023-01-21', '4:00 PM', '4-012123', 'Blazers', '2', '4', 'Punishers', '2023', 'complete'),
('2023-01-28', '6:00 PM', '6-012823', 'Ducks', '5', '4', 'Blazers', '2023', 'complete'),
('2023-01-28', '4:00 PM', '4-012823', 'Blades of Steel', '1', '2', 'Punishers', '2023', 'complete'),
('2023-01-28', '5:00 PM', '5-012823', 'Easy Company', '3', '7', 'The Irish', '2023', 'complete'),
('2023-02-04', '4:00 PM', '4-020423', 'Easy Company', '2', '3', 'Blades of Steel', '2023', 'complete'),
('2023-02-04', '6:00 PM', '6-020423', 'Blazers', '4', '3', 'P.C. United', '2023', 'complete'),
('2023-02-04', '5:00 PM', '5-020423', 'Ducks', '2', '4', 'Punishers', '2023', 'complete'),
('2023-02-11', '6:00 PM', '6-021123', 'Blazers', '4', '3', 'Blades of Steel', '2023', 'complete'),
('2023-02-11', '5:00 PM', '5-021123', 'Easy Company', '3', '4', 'P.C. United', '2023', 'complete'),
('2023-02-11', '4:00 PM', '4-021123', 'Ducks', '1', '2', 'The Irish', '2023', 'complete'),
('2023-02-18', '6:00 PM', '6-021823', 'Ducks', '4', '3', 'P.C. United', '2023', 'complete'),
('2023-02-18', '5:00 PM', '5-021823', 'Easy Company', '2', '3', 'Punishers', '2023', 'complete'),
('2023-02-18', '4:00 PM', '4-021823', 'Blades of Steel', '1', '7', 'The Irish', '2023', 'complete'),
('2023-02-25', '5:00 PM', '5-022523', 'Punishers', '3', '2', 'P.C. United', '2023', 'complete'),
('2023-02-25', '4:00 PM', '4-022523', 'Blazers', '2', '4', 'The Irish', '2023', 'complete'),
('2023-10-14', '4:00 PM', '4-101423', 'Punishers', '6', '1', 'P.C. United', '2024', 'complete'),
('2023-10-14', '6:00 PM', '6-101423', 'Ducks', '2', '6', 'The Irish', '2024', 'complete'),
('2023-10-14', '5:00 PM', '5-101423', 'Blazers', '4', '6', 'Blades of Steel', '2024', 'complete'),
('2023-10-21', '4:00 PM', '4-102123', 'Blades of Steel', '1', '4', 'The Irish', '2024', 'complete'),
('2023-10-21', '6:00 PM', '6-102123', 'Punishers', '2', '2', 'Easy Company', '2024', 'complete'),
('2023-10-21', '5:00 PM', '5-102123', 'Blazers', '6', '1', 'Ducks', '2024', 'complete'),
('2023-10-28', '4:00 PM', '4-102823', 'P.C. United', '6', '2', 'Blades of Steel', '2024', 'complete'),
('2023-10-28', '6:00 PM', '6-102823', 'Easy Company', '0', '3', 'Ducks', '2024', 'complete'),
('2023-10-28', '5:00 PM', '5-102823', 'Punishers', '5', '2', 'The Irish', '2024', 'complete'),
('2023-11-04', '4:00 PM', '4-110423', 'Blazers', '2', '6', 'The Irish', '2024', 'complete'),
('2023-11-04', '6:00 PM', '6-110423', 'P.C. United', '2', '0', 'Ducks', '2024', 'complete'),
('2023-11-04', '5:00 PM', '5-110423', 'Easy Company', '3', '5', 'Blades of Steel', '2024', 'complete'),
('2023-11-11', '4:00 PM', '4-111123', 'Punishers', '3', '2', 'Ducks', '2024', 'complete'),
('2023-11-11', '6:00 PM', '6-111123', 'Blazers', '3', '2', 'Easy Company', '2024', 'complete'),
('2023-11-11', '5:00 PM', '5-111123', 'P.C. United', '2', '2', 'The Irish', '2024', 'complete'),
('2023-11-18', '4:00 PM', '4-111823', 'P.C. United', '5', '3', 'Easy Company', '2024', 'complete'),
('2023-11-18', '6:00 PM', '6-111823', 'Punishers', '6', '0', 'Blazers', '2024', 'complete'),
('2023-11-18', '5:00 PM', '5-111823', 'Ducks', '3', '2', 'Blades of Steel', '2024', 'complete'),
('2023-11-25', '4:00 PM', '4-112523', 'Easy Company', '1', '4', 'The Irish', '2024', 'complete'),
('2023-11-25', '6:00 PM', '6-112523', 'Punishers', '5', '3', 'Blades of Steel', '2024', 'complete'),
('2023-11-25', '5:00 PM', '5-112523', 'P.C. United', '8', '5', 'Blazers', '2024', 'complete'),
('2023-12-02', '4:00 PM', '4-120223', 'P.C. United', '2', '1', 'Punishers', '2024', 'complete'),
('2023-12-02', '6:00 PM', '6-120223', 'Ducks', '2', '3', 'The Irish', '2024', 'complete'),
('2023-12-02', '5:00 PM', '5-120223', 'Blazers', '1', '3', 'Blades of Steel', '2024', 'complete'),
('2023-12-09', '4:00 PM', '4-120923', 'Blazers', '6', '3', 'Ducks', '2024', 'complete'),
('2023-12-09', '6:00 PM', '6-120923', 'Punishers', '8', '1', 'Easy Company', '2024', 'complete'),
('2023-12-09', '5:00 PM', '5-120923', 'Blades of Steel', '3', '6', 'The Irish', '2024', 'complete'),
('2023-12-16', '4:00 PM', '4-121623', 'Punishers', '1', '4', 'The Irish', '2024', 'complete'),
('2023-12-16', '6:00 PM', '6-121623', 'P.C. United', '2', '4', 'Blades of Steel', '2024', 'complete'),
('2023-12-16', '5:00 PM', '5-121623', 'Easy Company', '1', '4', 'Ducks', '2024', 'complete'),
('2024-01-06', '4:00 PM', '4-010624', 'Easy Company', '4', '1', 'Blades of Steel', '2024', 'complete'),
('2024-01-06', '6:00 PM', '6-010624', 'Blazers', '4', '0', 'The Irish', '2024', 'complete'),
('2024-01-06', '5:00 PM', '5-010624', 'P.C. United', '5', '2', 'Ducks', '2024', 'complete'),
('2024-01-13', '4:00 PM', '4-011324', 'P.C. United', '1', '4', 'The Irish', '2024', 'complete'),
('2024-01-13', '6:00 PM', '6-011324', 'Punishers', '4', '2', 'Ducks', '2024', 'complete'),
('2024-01-13', '5:00 PM', '5-011324', 'Blazers', '4', '5', 'Easy Company', '2024', 'complete'),
('2024-01-20', '4:00 PM', '4-012024', 'Ducks', '6', '4', 'Blades of Steel', '2024', 'complete'),
('2024-01-20', '6:00 PM', '6-012024', 'P.C. United', '2', '2', 'Easy Company', '2024', 'complete'),
('2024-01-20', '5:00 PM', '5-012024', 'Punishers', '5', '3', 'Blazers', '2024', 'complete'),
('2024-01-27', '4:00 PM', '4-012724', 'P.C. United', '4', '5', 'Blazers', '2024', 'complete'),
('2024-01-27', '6:00 PM', '6-012724', 'Easy Company', '1', '2', 'The Irish', '2024', 'complete'),
('2024-01-27', '5:00 PM', '5-012724', 'Punishers', '6', '3', 'Blades of Steel', '2024', 'complete'),
('2024-02-03', '4:00 PM', '4-020324', 'Blazers', '6', '2', 'Ducks', '2024', 'complete'),
('2024-02-03', '6:00 PM', '6-020324', 'Blades of Steel', '0', '3', 'The Irish', '2024', 'complete'),
('2024-02-03', '5:00 PM', '5-020324', 'Punishers', '2', '0', 'Easy Company', '2024', 'complete'),
('2024-02-10', '4:00 PM', '4-021024', 'Punishers', '1', '4', 'The Irish', '2024', 'complete'),
('2024-02-10', '6:00 PM', '6-021024', 'Easy Company', '7', '0', 'Ducks', '2024', 'complete'),
('2024-02-10', '5:00 PM', '5-021024', 'P.C. United', '6', '3', 'Blades of Steel', '2024', 'complete'),
('2024-02-17', '4:00 PM', '4-021724', 'Blazers', '2', '4', 'The Irish', '2024', 'complete'),
('2024-02-17', '6:00 PM', '6-021724', 'Easy Company', '3', '2', 'Blades of Steel', '2024', 'complete'),
('2024-02-17', '5:00 PM', '5-021724', 'P.C. United', '3', '2', 'Ducks', '2024', 'complete'),
('2024-02-24', '4:00 PM', '4-022424', 'Punishers', '5', '0', 'Ducks', '2024', 'complete'),
('2024-02-24', '6:00 PM', '6-022424', 'Blazers', '1', '7', 'Easy Company', '2024', 'complete'),
('2024-02-24', '5:00 PM', '5-022424', 'P.C. United', '3', '3', 'The Irish', '2024', 'complete'),
('2024-03-02', '4:00 PM', '4-030224', 'P.C. United', '1', '3', 'Punishers', '2024', 'complete'),
('2024-03-02', '6:00 PM', '6-030224', 'Blazers', '1', '4', 'Blades of Steel', '2024', 'complete')






