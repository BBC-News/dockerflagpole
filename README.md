# Docker Flagpole
A containerised application to manage flagpoles

## Environment
The system requires that the following versions of applications to be installed:

node v10.16.0 (npm v6.9.0)

### Installation
To install the system clone the repository ```git@github.com:bbc/bbc-gn-dockerflagpole.git``` and
then in the directory the repo was cloned to run ```npm install```

If testing/development is required to be done, run the following command ```npm install --dev```

### Building
In development, there is no building required. When the application is used in test or production, 
a docker image will have to be built.

#### Test docker build
In order to run the application as a stand-alone docker image running oin the tester's laptop, the tester
needs to start docker on thir laptop. Once docker is running run the
following command once installation is complete ```npm run docker-build-test```

#### Production docker build
In this situation the docker image needs to be built and sighed with appropriate keys so that the docker
 image can be managed with all the other docker images in Global News' ECS system.

Scripts for this have not yet been finalised but there are established mechasnisms for achieving this.

## Configuration
The app can be configured to be run in a number of different environments.

The app is configured with a YAML file that allows a very straight forward mechanism for setting out the 
different properties. Each target environment can have their own distinct set of properties.

PLease refer to the operation section for more information on how 
## Operation
Once the environment is setup the following operations can be done

### Startup
The application can be started up in several environmental states

#### Development
The application can be run with the following ```npm run start-dev```

By default the web address is used ```localhost:3000```

#### Test
In order to run the application as a stand-alone docker image running on the tester's laptop, the 
tester mus launch run the
following command once installation is complete ```npm run docker-launch-test```

The above command will launch

#### Production

### Functionality

### Testing

#### Jasmine

#### Cypress
