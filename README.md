# Huovet
Lempiellit - Huovet Project

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development. See deployment
for notes on deploying the project on a live system.

### Prerequisites

- Docker
- Docker Compose
- Node.js version >17.00.0

### Installing and running on your local machine

In order to get the backend running, go in the /backend directory and run

    docker-compose up --build -d

Frontend can be run by going in to /frontend directory and running

    npm install
    npm start


## Deployment

Deployment related code is in branch `virtual_machine`. 
When being in the branch `virtual_machine`, the whole project can be deployed in production mode by being in the project's root and running 

     docker-compose -f docker-compose.production.yml up
     
This project was deployed and configured to a virtual machine. The backend's API base url (which front end calls) is set to the virtual machine's public IP-address in the .env file located in frontend/ directory. That IP address must be configured to use the new VM's IP-address (base url).

## Good to know

- Some of the API-endpoints that take an existing id of some other data as a payload won't work if there is no related data in the database. 
- For example, The breed demands a parent specie and adding a breed when the species table is empty the addition fails.
- You can add related data from the frontend's management page or manually from inside the database's Docker container. 
