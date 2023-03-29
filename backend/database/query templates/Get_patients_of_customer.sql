
/*
Gets all patients of the specific customer
*/

SELECT id, name
FROM huovet.patient
WHERE customer_id = /*owner ID here*/
ORDER BY name;
