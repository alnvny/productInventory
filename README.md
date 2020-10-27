# productInventory

### Technology
These are the technologies used to develop the API:
* Node.js for program development
* Express for middleware implementation 
* Jasmine for unit test
* Docker for running the third party API

### Installation
These are the prerequisite to setup the API:
* Node.js v12+
* npm v6+
* docker

Setup instructions:
(Steps with referance to Windows OS)
* Clone the docker image using cmd `docker pull adichallenge/adichallenge:product-engine`
* run the docker image using cmd `docker-machine env --shell cmd default`
* validate http://localhost:3000/api-docs/ is accessble to confirm third party API is ready
* Clone this repo
* move to the productInventory folder
* execute   ``` npm install ```
* installation successful if no issues in this process

### Execution
API Engine can be started with the below command in the command prompt of the same folder path.
```sh
>node index.js
```
The API engine will be running in the localhost with port 3001

### Testing
You can run the test suite using the below command in the command prompt of the same folder path.
```sh
>npm test
```
* The above command will run the spec files in the spec folder
* All functions in the program are unit tested

**Developer : Gnana Allan Whinney GnanaPragasam, Chennai, India.**
