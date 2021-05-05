const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'qwerty1!',
    database: 'employee_tracker'
})

const startIntroQuestionaire = () => {
    inquirer
        .prompt([{
            name: 'userChoice',
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View All Departments', 'View All Roles', 'Add a Department', 'Add a Role', 'Update a Department', 'Update a Role', 'Remove a Department', 'Exit']
        }])
        .then((answer) => {
            switch(answer.userChoice) {
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add a Department':
                    addADepartment();
                    break;
                case 'Add a Role':
                    addARole();
                    break;
                case 'Update a Department':
                    updateADepartment();
                    break;
                case 'Update a Role':
                    updateRole();
                    break;
                case 'Remove a Department':
                    deleteADepartment();
                    break;
                case 'Exit':
                    exit();
                    break;
            }
        })
}

// department section
const updateADepartment = () => {
    inquirer
        .prompt([{
            name: 'userSelectedDept',
            type: 'list',
            message: 'Which department would you like to update?',
            choices: async () => {
                let p = await new Promise((success, fail) => {
                    connection.query('SELECT dept_name FROM department', (e, result) => {
                        if (e) throw e;
                        const deptList = result.map(dept => dept.dept_name);
                        success(deptList);
                    })
                }).then((deptList) => {return deptList});
                return p;
            }},{
                name: 'updateName',
                type: 'input',
                message: (answers) => `What would you like to update ${answers.userSelectedDept} to?`,
            },{
                name: 'confirm',
                type: 'list',
                message: (answers) => `Are you sure you want to update ${answers.userSelectedDept} to ${answers.updateName}?`,
                choices: ['Yes', 'No']
            }
        ])
        .then((answers) => {
            if (answers.confirm === 'No') {
                startIntroQuestionaire();
            } else {
                connection.query(`UPDATE department SET dept_name = '${answers.updateName}' WHERE dept_name = '${answers.userSelectedDept}'`, (e, result) => {
                    if (e) throw e;
                    console.log(`\nSuccessfully updated ${answers.userSelectedDept} to ${answers.updateName}.\n`);
                    startIntroQuestionaire();
                })
            }
        })
}

const addADepartment = () => {
    inquirer
        .prompt([{
            name: 'userDept',
            type: 'input',
            message: 'Enter a new department name:'
        }])
        .then( (answer) => {
            connection.query(`INSERT INTO department (dept_name) VALUES ('${answer.userDept}')`, (e, result) => {
                if (e) throw e;
                console.log('\nSuccessfully added new department.\n');
                startIntroQuestionaire();
            });
        })
};

const deleteADepartment = () => {
    inquirer
        .prompt([{
            name: 'userSelectedDept',
            type: 'list',
            message: 'Which department would you like to delete?',
            choices: async () => {
                let p = await new Promise((success, fail) => {
                    connection.query('SELECT dept_name FROM department', (e, result) => {
                        if (e) throw e;
                        const deptList = result.map(dept => dept.dept_name);
                        success(deptList);
                    })
                }).then((deptList) => {return deptList});
                return p;
            }},{
                name: 'confirm',
                type: 'list',
                message: (answers) => `Are you sure you want to remove the ${answers.userSelectedDept}?`,
                choices: ['Yes', 'No']
            }
        ])
        .then((answers) => {
            if (answers.confirm === 'No') {
                startIntroQuestionaire();
            } else {
                connection.query(`DELETE FROM department WHERE dept_name = '${answers.userSelectedDept}'`, (e, result) => {
                    if (e) throw e;
                    console.log(`\nSuccessfully removed the ${answers.userSelectedDept} department.\n`)
                    startIntroQuestionaire();
                })
            }
        })       
}

const viewAllDepartments = () => {
    connection.query(`SELECT * FROM department`, (e, result) => {
        if (e) throw e;
        console.table(result);
        startIntroQuestionaire();
    })
}
// end dept section

// role section
const addARole = () => {
    inquirer
        .prompt([{
            name: 'roleTitle',
            type: 'input',
            message: 'What is the name/title of the role?'
        },{
            name: 'salary',
            type: 'input',
            message: (answers) => `What is the salary for ${answers.roleTitle}:`
        },{
            name: 'department',
            type: 'list',
            message: 'What department does this role belong to?',
            choices: async () => {
                let p = await new Promise((success, fail) => {
                    connection.query('SELECT dept_name FROM department', (e, result) => {
                        if (e) throw e;
                        const deptList = result.map(dept => dept.dept_name);
                        success(deptList);
                    })
                }).then((deptList) => {return deptList});
                return p;
            }
        }])
        .then((answers) => {
            connection.query(`INSERT INTO role (title, salary, department_id)` + 
                             `VALUES ('${answers.roleTitle}', '${answers.salary}', (SELECT id FROM department WHERE dept_name = '${answers.department}'));`,
                             (e, result) => {
                                if (e) throw e;
                                console.log(`\nSuccessfully added ${answers.roleTitle} with salary of $${answers.salary} to department ${answers.department}.\n`);
                                startIntroQuestionaire();
                             })
        })
}

const viewAllRoles = () => {
    connection.query(`SELECT * FROM role`, (e, result) => {
        if (e) throw e;
        console.table(result);
        startIntroQuestionaire();
    })
}

const updateRole = () => {
    inquirer
    .prompt([{
        name: 'userSelectedDept',
        type: 'list',
        message: 'In which department is the role you would like to update located?',
        choices: async () => {
            let p = await new Promise((success, fail) => {
                connection.query('SELECT dept_name FROM department', (e, result) => {
                    if (e) throw e;
                    const deptList = result.map(dept => dept.dept_name);
                    success(deptList);
                })
            }).then((deptList) => {return deptList});
            return p;
        }},{
            name: 'roleSelect',
            type: 'list',
            message: 'Which role would you like to modify?',
            choices: async (answers) => {
                let p = await new Promise((success, fail) => {
                    connection.query(`SELECT title FROM role WHERE department_id=(SELECT id FROM department WHERE dept_name = '${answers.userSelectedDept}')`, (e, result) => {
                        if (e) throw e;
                        const roleList = result.map(role => role.title);
                        success(roleList);
                    })
                }).then((deptList) => {return deptList});
                return p;
        }},{
            name: 'whichPartOfRoleToUpdate',
            type: 'list',
            message: 'What would you like to modify?',
            choices: ['Title', 'Salary', 'Department']
        },{
            name: 'titleUpdate',
            type: 'input',
            message: (answers) => `What title would you like to change ${answers.roleSelect} to?`,
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Title'
        },{
            name:'confirm',
            type:'list',
            message: (answers) => `You would like to change ${answers.roleSelect} to ${answers.titleUpdate}?`,
            choices: ['Yes', 'Cancel'],
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Title'
        },{
            name: 'salaryUpdate',
            type: 'input',
            message: (answers) => `What is the new salary of ${answers.roleSelect}?`,
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Salary'
        },{
            name:'confirm',
            type:'list',
            message: (answers) => `You would like to change the salary of ${answers.roleSelect} to ${answers.salaryUpdate}?`,
            choices: ['Yes', 'Cancel'],
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Salary'
        },{
            name: 'departmentUpdate',
            type: 'list',
            message: (answers) => `Which department should ${answers.roleSelect} be a part of? [Currently: ${answers.userSelectedDept}]`,
            choices: async (answers) => {
                let p = await new Promise((success, fail) => {
                    connection.query(`SELECT dept_name FROM department WHERE NOT dept_name = '${answers.userSelectedDept}';`, (e, result) => {
                        if (e) throw e;
                        const deptList = result.map(dept => dept.dept_name);
                        success(deptList);
                    })
                }).then((deptList) => {return deptList});
                return p;
            },
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Department'
        },{
            name:'confirm',
            type:'list',
            message: (answers) => `You would like to change the department from ${answers.userSelectedDept} to ${answers.departmentUpdate}?`,
            choices: ['Yes', 'Cancel'],
            when: (answers) => answers.whichPartOfRoleToUpdate === 'Department'
        }])
        .then((answers) => {
            if (answers.confirm === 'Cancel') {
                startIntroQuestionaire();
            } else {
                switch (answers.whichPartOfRoleToUpdate) {
                    case 'Title':
                        connection.query(`UPDATE role SET title='${answers.titleUpdate}' WHERE title='${answers.roleSelect}'`, (e, result) => {
                            if (e) throw e;
                            console.log(`\nSuccessfully updated ${answers.roleSelect} to ${answers.titleUpdate}.\n`);
                            startIntroQuestionaire();
                        })
                        break;
                    case 'Salary':
                        connection.query(`UPDATE role SET salary='${answers.salaryUpdate}' WHERE title='${answers.roleSelect}'`, (e, result) => {
                            if (e) throw e;
                            console.log(`\nSuccessfully updated salary of ${answers.roleSelect} to $${answers.salaryUpdate}.\n`);
                            startIntroQuestionaire();
                        })
                        break;
                    case 'Department':
                        connection.query(`UPDATE role SET department_id=(SELECT id FROM department WHERE dept_name ='${answers.departmentUpdate}') WHERE title='${answers.roleSelect}'`, (e, result) => {
                            if (e) throw e;
                            console.log(`\nSuccessfully updated department of ${answers.roleSelect} from ${answers.userSelectedDept} to ${answers.departmentUpdate}.\n`);
                            startIntroQuestionaire();
                        })
                        break;
                }
            }
        })
}

const deleteRole = () => {
    
}

// exit function
const exit = () => {
    console.log(`\nThank you for using the Employee Management System, have a great day!\n`);
    connection.end();
    process.exit(0);
}

// initialization function
const init = () => {
    console.log(`\nWelcome to the Employee Management System\n`);

    connection.connect();

    startIntroQuestionaire();
}

init();