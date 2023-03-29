
CREATE SCHEMA huovet;

CREATE TABLE huovet.customer(
id INT AUTO_INCREMENT,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
street_address VARCHAR(255),
zip_code VARCHAR(255),
municipality VARCHAR(255),
phone_number VARCHAR(255),
email VARCHAR(255),
ssn VARCHAR(255),
PRIMARY KEY (id)
);

CREATE TABLE huovet.species(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE TABLE huovet.breed(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
average_weight INT, /*as grams*/
species_id INT NOT NULL,
PRIMARY KEY (id),
UNIQUE (name),
FOREIGN KEY (species_id) REFERENCES huovet.species(id) ON DELETE CASCADE
);

CREATE TABLE huovet.patient(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
sex ENUM('male','female', 'sterilizedFemale', 'castratedMale','unknown') NOT NULL,
date_of_birth DATE,
weight INT, /*as grams*/
microchip VARCHAR(255),
customer_id INT NOT NULL,
breed_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (customer_id) REFERENCES huovet.customer(id) ON DELETE CASCADE,
FOREIGN KEY (breed_id) REFERENCES huovet.breed(id) ON DELETE CASCADE
);

CREATE TABLE huovet.staff(
id INT AUTO_INCREMENT,
first_name VARCHAR(255) NOT NULL,
last_name VARCHAR(255) NOT NULL,
role VARCHAR(255),
PRIMARY KEY (id)
);

CREATE TABLE huovet.appointment_type(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
default_length INT, /*as minutes*/
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE TABLE huovet.appointment(
id INT AUTO_INCREMENT,
starting_date DATETIME NOT NULL,
ending_date DATETIME,
length INT NOT NULL, /*as minutes*/
anamnesis TEXT,
status TEXT,
treatment TEXT,
arrived BOOLEAN NOT NULL,
appointment_type_id INT NOT NULL,
staff_id INT NOT NULL,
billed BOOLEAN NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (appointment_type_id) REFERENCES huovet.appointment_type(id) ON DELETE CASCADE,
FOREIGN KEY (staff_id) REFERENCES huovet.staff(id) ON DELETE CASCADE
);

CREATE TABLE huovet.template(
id INT AUTO_INCREMENT,
type ENUM('status','treatment') NOT NULL,
template_text TEXT NOT NULL,
appointment_type_id INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (appointment_type_id) REFERENCES huovet.appointment_type(id) ON DELETE CASCADE
);

CREATE TABLE huovet.examination_type(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
category ENUM('examination','operation') NOT NULL,
price DECIMAL(9,2) NOT NULL,
location VARCHAR(255) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE huovet.diagnosis(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
code VARCHAR(255),
PRIMARY KEY (id),
UNIQUE (name)
);

CREATE TABLE huovet.medicine(
id INT AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
unit ENUM('pcs','g','ml') NOT NULL,
active_substance VARCHAR(255) NOT NULL,
strength VARCHAR(255) NOT NULL,
PRIMARY KEY (id)
);

CREATE TABLE huovet.supplies(
id INT AUTO_INCREMENT,
number VARCHAR(50) NOT NULL,
name VARCHAR(255) NOT NULL,
type ENUM('medicine','food','other') NOT NULL,
unit ENUM('pcs','g','ml') NOT NULL,
price DECIMAL(9,2) NOT NULL,
PRIMARY KEY (id),
UNIQUE (name,type)
);

CREATE TABLE huovet.as_patient(
patient_id INT,
appointment_id INT,
PRIMARY KEY (patient_id, appointment_id),
FOREIGN KEY (patient_id) REFERENCES huovet.patient(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE
);

CREATE TABLE huovet.examination(
examination_type_id INT,
patient_id INT,
appointment_id INT,
result TEXT,
price DECIMAL(9,2) DEFAULT 0.00,
PRIMARY KEY (examination_type_id, patient_id, appointment_id),
FOREIGN KEY (examination_type_id) REFERENCES huovet.examination_type(id) ON DELETE CASCADE,
FOREIGN KEY (patient_id) REFERENCES huovet.patient(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE
);

CREATE TABLE huovet.diagnosed(
diagnosis_id INT,
patient_id INT,
appointment_id INT,
info_text TEXT,
PRIMARY KEY (diagnosis_id, patient_id, appointment_id),
FOREIGN KEY (diagnosis_id) REFERENCES huovet.diagnosis(id) ON DELETE CASCADE,
FOREIGN KEY (patient_id) REFERENCES huovet.patient(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE
);

CREATE TABLE huovet.prescribed(
medicine_id INT,
patient_id INT,
appointment_id INT,
dosage INT,
amount INT NOT NULL,
PRIMARY KEY (medicine_id, patient_id, appointment_id, dosage),
FOREIGN KEY (medicine_id) REFERENCES huovet.medicine(id) ON DELETE CASCADE,
FOREIGN KEY (patient_id) REFERENCES huovet.patient(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE
);

CREATE TABLE huovet.used(
supplies_id INT,
patient_id INT,
appointment_id INT,
amount INT NOT NULL,
price DECIMAL(9,2) DEFAULT 0.00,
PRIMARY KEY (supplies_id, patient_id, appointment_id),
FOREIGN KEY (supplies_id) REFERENCES huovet.supplies(id) ON DELETE CASCADE,
FOREIGN KEY (patient_id) REFERENCES huovet.patient(id) ON DELETE CASCADE,
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE
);

CREATE TABLE huovet.billing(
bill_number INT AUTO_INCREMENT,
appointment_id INT NOT NULL,
due_date DATETIME NOT NULL,
paid BOOLEAN NOT NULL,
service_price DECIMAL(9,2) NOT NULL,
PRIMARY KEY (bill_number),
FOREIGN KEY (appointment_id) REFERENCES huovet.appointment(id) ON DELETE CASCADE,
UNIQUE (appointment_id)
);

ALTER TABLE huovet.billing AUTO_INCREMENT=1000001;

SET SQL_SAFE_UPDATES = 0;

delimiter //
CREATE PROCEDURE huovet.delete_appointments()
BEGIN
	DELETE FROM huovet.appointment AS a
    WHERE a.id NOT IN (
        SELECT DISTINCT appointment_id
        FROM huovet.as_patient
    );
END;//
delimiter ;

/*Since cascades don't call triggers in MySQL, the deletion trigger has to be defined for every table that can cascade-delete as_patient*/

CREATE TRIGGER huovet.customer_delete_appointment AFTER DELETE ON huovet.customer
FOR EACH ROW CALL huovet.delete_appointments();

CREATE TRIGGER huovet.patient_delete_appointment AFTER DELETE ON huovet.patient
FOR EACH ROW CALL huovet.delete_appointments();

CREATE TRIGGER huovet.as_patient_delete_appointment AFTER DELETE ON huovet.as_patient
FOR EACH ROW CALL huovet.delete_appointments();

CREATE TRIGGER huovet.breed_delete_appointment AFTER DELETE ON huovet.breed
FOR EACH ROW CALL huovet.delete_appointments();

CREATE TRIGGER huovet.species_delete_appointment AFTER DELETE ON huovet.species
FOR EACH ROW CALL huovet.delete_appointments();