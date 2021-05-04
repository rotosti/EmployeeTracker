-- SCHEMA -- 

DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;
CREATE TABLE department (
	id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30)
);

USE employee_tracker;
CREATE TABLE role (
	id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    CONSTRAINT fk_deptID
    FOREIGN KEY (department_id) 
		REFERENCES department(id)
);

USE employee_tracker;
CREATE TABLE employee (
	id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT DEFAULT NULL,
    CONSTRAINT fk_roleID
    FOREIGN KEY (role_id)
		REFERENCES role(id),
	CONSTRAINT fk_mgrID
    FOREIGN KEY (manager_id)
		REFERENCES employee(id)
)