
/*
Query checks if a customer with the same first name, last name and phone number and/or email exists already. 
Returns 0 if false and 1 if true.
Values are not case sensitive.
*/

/*First name and last name must have string values, phone number and email can be string values or NULL values, but only one of them can be NULL*/
SET @fname = /*First name here*/;
SET @lname = /*Last name here*/;
SET @phone = NULL/*Phone number or NULL here*/;
SET @email = NULL/*Email address or NULL here*/;

SELECT
CASE WHEN EXISTS(
SELECT first_name, last_name, phone_number, email
FROM huovet.customer
WHERE UPPER(first_name) LIKE UPPER(@fname) AND
UPPER(last_name) LIKE UPPER(@lname) AND
(UPPER(phone_number) LIKE UPPER(@phone) OR
UPPER(email) LIKE UPPER(@email))
) THEN 1
ELSE 0
END AS 'Customer exists';
