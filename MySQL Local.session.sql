        SELECT * FROM users;
INSERT INTO users (username, email , password , created_at , grade) VALUES ('john_doe', 'john.doe@example.com', 'securepassword', NOW(), NULL);


EXPLAIN ANALYZE
SELECT *
FROM Customers
WHERE age = 25;