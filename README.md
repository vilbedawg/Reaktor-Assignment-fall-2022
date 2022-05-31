# Poetry parser
https://vilbedawg-parser.herokuapp.com/

*The parser itself can be found from the utilities folder.*

This is a simple application to parse users poetry.lock files and to reveal some key information about the installed packages. Upon uploading a file, the user will receive a list of packages that were included in the file. The user can then get more information about each package by clicking on it. Some information was left out for simplicity sake, but the information that is provided from each package are:
* Name
* Description
* Category
* Optional
* Python versions
* The names of the required dependencies
* The names of the optional dependencies
* The reverse dependencies' names, which are the packages that depend on the current package. If these dependecies are installed, the user can navigate the package structure by clicking from package to package.

The sample file used in development was the provided poetry.lock file from the [Poetry repository](https://github.com/python-poetry/poetry/blob/70e8e8ed1da8c15041c3054603088fce59e05829/poetry.lock). 



https://user-images.githubusercontent.com/82541244/170973577-dadccc61-4c43-4696-a56b-fa657771de16.mp4


### This application was built with:
* React
* Node.js & Express
