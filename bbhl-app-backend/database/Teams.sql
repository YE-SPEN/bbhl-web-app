CREATE TABLE Teams (
	id VARCHAR(30) PRIMARY KEY,
	name VARCHAR(30),
	captain VARCHAR(90) REFERENCES Players(name),
	logo VARCHAR(255)
);

INSERT INTO Teams (id, name, captain, logo) VALUES 
('bladesofsteel', 'Blades of Steel', 'Tyler Watt', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/BOS.png?fit=128%2C118&ssl=1'),
('blazers', 'Blazers', 'Danny Andrzejewski', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/Blazers.png?fit=128%2C118&ssl=1'),
('ducks', 'Ducks', 'Lucas Scullion', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/MDucks.png?fit=128%2C120&ssl=1'),
('easycompany', 'Easy Company', 'Justin Romeo', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/EC.png?fit=128%2C118&ssl=1'),
('pcu', 'P.C. United', 'Alex Lemay', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/PCU.png?fit=128%2C120&ssl=1'),
('punishers', 'Punishers', 'Eric Spensieri', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/Punishers.png?fit=128%2C120&ssl=1'),
('irish', 'The Irish', 'Ryan Handfield', 'https://i0.wp.com/www.thebbhl.ca/wp-content/uploads/2022/10/Irish.png?fit=128%2C120&ssl=1')
('churchers', 'Churchers', 'Brandon Runnings', 'https://i0.wp.com/thebbhl.ca/wp-content/uploads/2016/09/ChurchersLogo.png?resize=150%2C150&ssl=1'),
('kingsmen', 'Kingsmen', 'Ryan Gore', 'https://i0.wp.com/thebbhl.ca/wp-content/uploads/2016/09/KingsmenLogo.png?resize=108%2C128&ssl=1')


