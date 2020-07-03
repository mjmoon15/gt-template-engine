//import employee classes
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
//npm packages
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
//import employee questions
const managerQuestions = require("./data/managerQuestions");
const engineerQuestions = require("./data/engineerQuestions");
const internQuestions = require("./data/internQuestions");

const employees = [];
const employeeType = {
    type: "list",
    name: "employeeType",
    message: "Which type of employee would you like to add?",
    choices: ["Engineer", "Intern"]
}
const moreEmployees = {
    type: "confirm",
    name: "addAnother",
    message: "Do you want to add another employee?"
}


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

//ask the manager things
const getManagerInfo = () => {
    inquirer
        .prompt(managerQuestions())
        .then((results) => {
            results.employeeType = 'Manager';
            getMoreEmployees(results);
        })
        .catch((err) =>{
            console.log(err)
        })
}
//ask the other employee things
const getEmployeeInfo = () => {
    inquirer
        .prompt(employeeType)
        .then((results) => {
            //switch/case to determine employee type and then ask correct sets of questions
            switch (results.employeeType) {
                case 'Engineer':
                    inquirer
                        .prompt(engineerQuestions())
                        .then((res) => {
                            res.employeeType = 'Engineer';
                            getMoreEmployees(res)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    break;
                case 'Intern':
                    inquirer   
                        .prompt(internQuestions())
                        .then((res) => {
                            res.employeeType = 'Intern';
                            getMoreEmployees(res)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    break;
            }
        })
    .catch((err) => {
        console.log(err)
    })
}

//keep getting more employees?
const getMoreEmployees = (results) => {
    const { name, id, email } = results;
    inquirer
        .prompt(moreEmployees)
        .then((res) => {
            let newEmployee;
            //switch/case for creating new employee object types
            switch (results.employeeType) {
                case 'Manager':
                    newEmployee = new Manager(name, id, email, results.officeNumber);
                    break;
                case 'Engineer':
                    newEmployee = new Engineer(name, id, email, results.github);
                    break;
                case 'Intern':
                    newEmployee = new Intern(name, id, email, results.school)
                    break;
            }
            employees.push(newEmployee);
            if (res.addAnother) {
                getEmployeeInfo()
            } else {
                const renderEmployees = render(employees);
                fs.writeFile(outputPath, renderEmployees, (err) => {
                    if (err) throw err;
                    console.log('Saved file')
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })

}
//fire it off
getManagerInfo()



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
