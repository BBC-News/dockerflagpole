# Docker Flagpole
A containerised application to manage flagpoles

## Environment
The system requires that the following versions of applications to be installed:

node v12.11.1 (npm v6.11.3)

### Installation
To install the system clone the repository ```git@github.com:bbc/bbc-gn-dockerflagpole.git``` and
then in the directory the repo was cloned to run ```npm install```

If unit testing/development is required to be done, run the following command ```npm install --dev```

## Operation
Once the environment is setup the following operations can be done

### Startup
The application can be run with the following ```npm run start```

By default the web address is used ```localhost:3000```

#### Endpoints
Flagpoles can be manipul;ated in the following ways

##### List
The default operation of the system is to list flagpoles and their values as an ordered list in a browser at ```/```

##### Update
If a flagpole value is required to be updated the use the following endpoint and arguments
```/update?name=<name of flagpole>&value=<new flagpole value>```

The named flagpole will be set according to the provided value where true,Y,y,1 are all considered true.
Once the flagpole is updated successfully, all flagpoles are displayed with their values.

If the flagpole name is not known, a 404 return status will result and an error message will be displayed

If the flagpole name or value is not provided a 403 return status will result and an error message will be displayed

### Unit testing
The unit tests can be run with the following command ```npm run test```

N.B. The system must be running prior to running the tests which assume the following web address ```localhost:3000```

## Configuration
The system can be configured to operated in the following environments 

NOT YET DEVELOPED

### Development
### Test
### Production
