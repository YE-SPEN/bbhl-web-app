CREATE TABLE doku_answers (
    player VARCHAR(90),
    team_1 VARCHAR(30),
    team_2 VARCHAR(30),
    guessed INT(4) DEFAULT 1,
    PRIMARY KEY (player, team_1, team_2)
);

DELIMITER //

CREATE TRIGGER doku_insert
BEFORE INSERT ON Doku_Answers
FOR EACH ROW
BEGIN
    IF NEW.team_1 > NEW.team_2 THEN
        SET @temp = NEW.team_1;
        SET NEW.team_1 = NEW.team_2;
        SET NEW.team_2 = @temp;
    END IF;
END //

DELIMITER ;
