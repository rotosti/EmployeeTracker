Author: Tomasz Siemion
Project: EmployeeTracker
DEMO LINK:

# EmployeeTracker
This application is a simple command line interface application to manage employees, departments, and their roles.

## Installation
This application uses the following NodeJS modules: Inquirer, MySQL, and console.table.  To install, run the following command in the terminal targeting your project directory:

```bash
npm i
```

You will also need to set up a MySQL database with the attached 'schema.sql' file which can be copied and pasted into MySQL Workbench for a Quick start.

## Usage
The application can get started with the following CLI command:

```bash
node server.js
```

The terminal must be pointing at the directory of the 'server.js' file.

## Functionality
The application is interfaced with the CLI.  The app uses Inquirer to format the interface.  The interface is populated with MySQL queries dynamically.  As the database is updated, it will always populate fresh data based on what the user selects to do.

## Future Updates
1. Updating managers for employees
2. Deleting employees
3. More detailed reports (i.e. viewing total salaries per department, viewing employees by managers, etc)
4. Better error handling
5. Handling of an empty database in certain searches
6. Custom report searches