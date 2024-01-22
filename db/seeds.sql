INSERT INTO department (name)
VALUES 
('Human Resources'),
('Legal'),
('Engineering'),
('Creative');

INSERT INTO role (title, salary, department_id)
VALUES 
('UX UI Designer', 105000, 4),
('Software Engineer', 110000, 3),
('Lawyer', 90000, 2),
('Graphic Designer', 65000, 4),
('Recruitment Consultant', 70000, 1),
('Project Manager', 80000, 1),
('Creative Director', 120000, 4),
('Data Scientist', 100000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Mike', 'Chan', 1, null),
('Jim', 'Smith', 2, 1),
('John', 'Doe', 3, null),
('Emily', 'Wong', 4, 1),
('Oliver', 'Brown', 5, null),
('Sophia', 'Green', 6, null),
('David', 'White', 7, 1),
('Abel', 'Gray', 8, 3);