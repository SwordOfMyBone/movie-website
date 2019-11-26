INSERT INTO movies(movie, Details) VALUES("Avatar", "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home."), ("Avengers EG", "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe."), ("Avengers IW", "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation and ruin puts an end to the universe."), ("Scary Movie", "A year after disposing of the body of a man they accidentally killed, a group of dumb teenagers are stalked by a bumbling serial killer.");

INSERT INTO showingSchedule(date, time, movie) VALUES("01-12-2019", "17:00", "Avatar"), ("01-12-2019", "20:00", "Avatar"), ("01-12-2019", "17:00", "Avengers IW"), ("01-12-2019", "20:00", "Avengers IW"), ("01-12-2019", "17:00", "Avengers EG"), ("01-12-2019", "20:00", "Avengers EG"), ("01-12-2019", "17:00", "Scary Movie"), ("01-12-2019", "20:00", "Scary Movie");

INSERT INTO movieTicket(showNumber, low, medium, high) VALUES(1, 10, 10, 10), (2, 10, 10, 10), (3, 10, 10, 10), (4, 10, 10, 10), (5, 10, 10, 10), (6, 10, 10, 10), (7, 10, 10, 10), (8, 10, 10, 10);

INSERT INTO pricing(showNumber, LP, MP, HP) VALUES(1, 5, 10, 15), (2, 5, 10, 15), (3, 5, 10, 15), (4, 5, 10, 15), (5, 5, 10, 15), (6, 5, 10, 15), (7, 5, 10, 15), (8, 5, 10, 15);

INSERT INTO management(time, movie, totalIncome) VALUES("17:00", "Avatar", 0), ("20:00", "Avatar", 0), ("17:00", "Avengers IW", 0), ("20:00", "Avengers IW", 0), ("17:00", "Avengers EG", 0), ("20:00", "Avengers EG", 0), ("17:00", "Scary Movie", 0), ("20:00", "Scary Movie", 0);


