
/*
Gets the ID, date and type of all appointments of the specific patient.
Looks slightly messy because of optimized query form.
*/

SELECT a.id, a.starting_date, t.name
FROM (
    SELECT a.id, a.starting_date, a.appointment_type_id
    FROM (
        SELECT id, starting_date, appointment_type_id
        FROM huovet.appointment
    ) AS a INNER JOIN (
        SELECT appointment_id
        FROM huovet.as_patient
        WHERE patient_id = /*patient ID here*/
    ) AS p ON a.id = p.appointment_id
) AS a INNER JOIN (
    SELECT id, name
    FROM huovet.appointment_type
) AS t ON a.appointment_type_id = t.id
ORDER BY a.starting_date DESC;
