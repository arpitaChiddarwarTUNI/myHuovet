
/*
Gets the ID, date and type of all appointments of the specific customer.
Looks slightly messy because of optimized query form.
*/

SELECT DISTINCT a.id, a.starting_date, t.name
FROM (
    SELECT a.id, a.starting_date, a.appointment_type_id
    FROM (
        SELECT id, starting_date, appointment_type_id
        FROM huovet.appointment
    ) AS a INNER JOIN (
        SELECT ap.appointment_id
        FROM huovet.as_patient AS ap INNER JOIN (
            SELECT id
            FROM huovet.patient
            WHERE customer_id = /*owner ID here*/
        ) AS p ON ap.patient_id = p.id
    ) AS p ON a.id = p.appointment_id
) AS a INNER JOIN (
    SELECT id, name
    FROM huovet.appointment_type
) AS t ON a.appointment_type_id = t.id
ORDER BY a.starting_date DESC;
