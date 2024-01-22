const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  multipleStatements: true,
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'stinawina9128',
  database: 'employees_db',
});

connection.connect((err) => {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Quit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Departments':
          viewDepartments();
          break;
        case 'View All Roles':
          viewRoles();
          break;
        case 'View All Employees':
          viewEmployees();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateRole();
          break;
        case 'Quit':
          connection.end();
          break;
      }
    });
}

function viewTable(tableName, header, fields) {
  const query = `SELECT * FROM ${tableName}`;
  connection.query(query, (err, rows) => {
    if (err) throw err;
    console.log(header);
    rows.forEach((row) => {
      const rowData = fields.map((field) => `${field}: ${row[field]}`).join(' | ');
      console.log(rowData);
    });
    start();
  });
}

function viewDepartments() {
  viewTable('department', 'DEPARTMENTS:', ['id', 'name']);
}

function viewRoles() {
  viewTable('role', 'ROLES:', ['id', 'title', 'salary', 'department_id']);
}

function viewEmployees() {
  viewTable('employee', 'EMPLOYEES:', ['id', 'first_name', 'last_name', 'role_id', 'manager_id']);
}

function addDepartment() {
  inquirer
    .prompt({
      name: 'department',
      type: 'input',
      message: "What is the name of the new department?",
    })
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      connection.query(query, answer.department, (err) => {
        if (err) throw err;
        console.log(`You have added this department: ${answer.department.toUpperCase()}.`);
        viewDepartments();
      });
    });
}

function addRole() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: "What is the title of the new role?",
        },
        {
          name: 'salary',
          type: 'input',
          message: "What is the salary of the new role?",
        },
        {
          name: 'departmentName',
          type: 'list',
          message: "Which department does this role fall under?",
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answer) => {
        const department = answer.departmentName;
        const selectedDepartment = departments.find((d) => d.name === department);
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        const values = [answer.title, answer.salary, selectedDepartment.id];
        connection.query(query, values, (err) => {
          if (err) throw err;
          console.log(`You have added this role: ${answer.title.toUpperCase()}.`);
          viewRoles();
        });
      });
  });
}

function addEmployee() {
    connection.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
      connection.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              name: 'firstName',
              type: 'input',
              message: "What is the employee's first name?",
            },
            {
              name: 'lastName',
              type: 'input',
              message: "What is the employee's last name?",
            },
            {
              name: 'roleName',
              type: 'list',
              message: "What role does the employee have?",
              choices: roles.map((role) => role.title),
            },
            {
              name: 'managerName',
              type: 'list',
              message: "Who is the employee's manager?",
              choices: employees.map((employee) => employee.last_name),
            },
          ])
          .then((answer) => {
            const selectedRole = roles.find((role) => role.title === answer.roleName);
            const selectedManager = employees.find((employee) => employee.last_name === answer.managerName);
  
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            const values = [answer.firstName, answer.lastName, selectedRole.id, selectedManager.id];
  
            connection.query(query, values, (err) => {
              if (err) throw err;
              console.log(`You have added this employee: ${answer.firstName.toUpperCase()}.`);
              viewEmployees();
            });
          });
      });
    });
  }
  
  function updateRole() {
    connection.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
      connection.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
  
        inquirer
          .prompt([
            {
              name: 'employeeName',
              type: 'list',
              message: "Which employee's role is changing?",
              choices: employees.map((employee) => employee.last_name),
            },
            {
              name: 'newRoleName',
              type: 'list',
              message: "What is their new role?",
              choices: roles.map((role) => role.title),
            },
          ])
          .then((answer) => {
            const selectedEmployee = employees.find((employee) => employee.last_name === answer.employeeName);
            const selectedRole = roles.find((role) => role.title === answer.newRoleName);
  
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            const values = [selectedRole.id, selectedEmployee.id];
  
            connection.query(query, values, (err) => {
              if (err) throw err;
              console.log(`You have updated ${selectedEmployee.first_name}'s role to ${selectedRole.title}.`);
              viewEmployees();
            });
          });
      });
    });
  }