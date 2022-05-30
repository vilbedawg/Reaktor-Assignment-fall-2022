# Poetry parser
This is a simple application to parse users poetry.lock files and to reveal some key information about the installed packages. Upon uploading a file, the user will receive a list of packages that were included in the file. The user can then get more information about each package by clicking on it:
* Name
* Description
* Category
* Optional
* Python versions
* The names of the required dependencies
* The names of the optional dependencies
* The reverse dependencies' names, which are the packages that depend on the current package. If all dependencies are installed, the user can navigate the package structure by clicking from package to package.



## The application was built using:
* React
* Node.js & Express

# How to setup the project locally

1. Clone this repository to your local machine

2. npm install to install all the necessary packages

3. npm start in the project directory

4. Open http://localhost:3000 to view it in the browser
