
/*
Query searches for customers with names that match the search keyword.
Keyword must be a substring of 'fname lname', 'lname fname', phone number or email to match.
Matching is not case sensitive. Results are limited to 100.
*/

SELECT id, first_name, last_name
FROM huovet.customer
WHERE CONCAT(first_name,' ',last_name) LIKE (CONCAT('%',/*Keyword here*/,'%')) OR
CONCAT(last_name,' ',first_name) LIKE (CONCAT('%',/*Keyword here*/,'%')) OR
phone_number LIKE (CONCAT('%',/*Keyword here*/,'%')) OR
email LIKE (CONCAT('%',/*Keyword here*/,'%'))
LIMIT 100;
