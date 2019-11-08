# Docker Flagpole
A containerised application to manage flagpoles in a JSON file that is accessible to
 all applications operating in an environment

## Environment
The system requires that the following versions of applications to be installed:

node v10.16.0 (npm v6.9.0)

### Installation
To install the system clone the repository ```git@github.com:bbc/bbc-gn-dockerflagpole.git``` and
then, in the directory the repo was cloned into, run ```npm install```

If testing/development is required to be done, also run the following command ```npm install --dev```

### Building
In development there is no further building required. When the application is used in test
 or production, a docker image will have to be built.

#### Test docker build
In order to run the application as a stand-alone docker image running on the tester's laptop, the tester
needs to start docker on their laptop. Once the docker application is running, run the
following command once to build a testing docker image ```npm run docker-build-test```

#### Production docker build
In this situation the docker image needs to be built and signed with appropriate keys so that it can be 
managed with all the other docker images in Global News' ECS system.

Scripts for this have not yet been finalised but there are established mechanisms for achieving this used
in previous projects.

## Configuration
The app can be configured to be run in a number of different environments. This is achieved with a YAML file that
allows a very straight forward mechanism for setting out the different properties for each environment.
Each target environment can have their own distinct set of properties.

Here are the configuration values that can be set for each environment:-
* port - This is the port thaat the application will operate on.
* source - The is the file that flagpole data will be read from and written to in an environment.
* domain - This is not actively used at the moment but may prove useful later.

Please refer to the operation section for more information on how each configuration value is used in each 
different environment.

### Flagpole data
The flagpole data will be the following JSON structure in all environments but each environment can specify their
own storage location (see source config above) as required.

```
{
    <flagpole name> : <flagpole data (boolean)>,
    .....
}
```

## Operation
Once the environment is installed the following operational capabilities are possible.

### Startup
The application can be started up in several environments the each section below describes that environment.

#### Development startup
The application can be run with the following ```npm run start-dev```
which will connect to the following web address on the user's machine ```localhost:3000```.

The port used is defined in the dev configuration. The file that is used a source for flagpoles is a checked in 
standard file that only serves for testing. If the developer wishes to add new or edit existing flagpoles,
Cypress or Jasmine tests should be adjusted to fir the new values.

#### Test startup
In test the app is run as a stand-alone docker image running on the tester's laptop, the 
tester must launch docker image with the following command ```npm run docker-launch-test```.

N.B. The tester must have built the image to run first (see building section)

The above command will launch the docker container which will, by default, connect the app running against
localhost:3000 on the local docker image to localhost:3000 on the tester's browser. The port that is used and the 
command to start the app on that port is part of the setup of the docker image.

The app will be configured to read from and write to an agreed S3 bucket hosted file that will be accessible 
to all test applications requiring flagpole data.

#### Production startup
When in production the app will run as its own EC2 container as part of the standard ECS that Global News runs. This
means that there is no startup command that has to be issued by the user.

The image instance that is run will be accessible via a public web address that will route all web traffic to 
the appropriate port on the image (part of config????) and therefore to the production app.
The port that is used and the command to start the app on that port in the container is part of the setup of 
the docker image.

The app will be configured to read from and write to an agreed S3 bucket hosted file that will be accessible 
to all live applications requiring flagpole data.
 
### Functionality
When opened the app will display a list of flagpoles read from the configured source for that environment.
All flagpoles found in the source configured for that environment are displayed to the user.

#### Flagpole display
Each flagpole display will have the following UI details :-
* Name - The capitalized name of the flagpole.
* Current Value - The boolean value of the flagpole will be displayed as text

#### Flagpole editing
Below the flagpole description the following UI controls will be displayed
* True radio - Initially selected if the flagpole state is true. Can set a flagpole state from false to true.
* False radio - Initially selected if the flagpole state is false. Can set a flagpole state from true to false.
* Update button - A button to write the current flagpole state to file if the state of the flagpole has changed.

Clicking the update button will set the value of the flagpole to the current state of the radio buttons and cause
all flagpoles to be written out to the source file. Once the write has completed successfully, all flagpoles will
be refreshed on the screen to display the new value.

### Testing
Testing is now done using Cypress rather than jasmine as the UI has now been changed and all test that were 
run in Jasmine are now covered by Cypress.

The Cypress tests are javascript spec files in the directory ```cypress/integration``` and can be
chosen to be run by issuing the following commands based on the environment. The tests have been designed to
read in the configuration for an enviroment and base the tests on that configuration.
 
There are two main tests, active and static tests.
* Static tests - These tests test that all flagpoles are displayed correctly in the UI.
* Active tests - These tests operate the editing functionaliy of the UI to check the behaviour.
  
#### Development environment testing
The following command will start up the Cypress environment that will execute the tests in the development
 environment ```npm run cypress-dev```. Prior to running this command the developer will need to launch the development
 server.
 
Both sets of tests will use the dev source and check the display in using the localhost port defined in the configuration.

#### Test enviroment testing
The following command will start up the Cypress environment that will execute the tests in the test
 environment ```npm run cypress-test```. Prior to running the command a tester needs to build and launch the
 test docker container that will actually operate the tests. 
 
Both sets of tests will use the test flagpoles source and check the display in using the localhost port defined in 
the configuration. Where this differs from development is that the localhost port will be communicating with
a docker image running the flagpoles app.
  
#### Production environment testing
The following command will start up the Cypress environment that will execute the tests in the live
 environment ```npm run cypress-live```.
 
Both sets of tests will use the dev source and check the display in using the live domain defined in the 
configuration.
   
