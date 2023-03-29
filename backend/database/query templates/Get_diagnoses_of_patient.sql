
/*
Gets the name, code and date of all diagnoses of the patient.
Includes appointment ID for accessing the appointment when the diagnosis was given.
Looks slightly messy because of optimized query form.
*/

SELECT a.id, a.starting_date, d.name, d.code
FROM (
    SELECT a.name, a.code, b.appointment_id
    FROM huovet.diagnosis AS a INNER JOIN (
        SELECT diagnosis_id, appointment_id
        FROM huovet.diagnosed
        WHERE patient_id = /*patient ID here*/
    ) AS b ON a.id = b.diagnosis_id
) AS d INNER JOIN (
    SELECT id, starting_date
    FROM huovet.appointment
) AS a ON d.appointment_id = a.id
ORDER BY a.starting_date DESC;
