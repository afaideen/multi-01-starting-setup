

Section 5: Building Multi Container Apps with Docker
https://www.udemy.com/course/docker-kubernetes-the-practical-guide/learn/lecture/31793712#overview

References:
- https://www.mongodb.com/docs/manual/reference/connection-string/

##########################//create network and install then run mongodb
docker pull mongo
docker network ls
docker network create goals-net
docker run --name mongodb -d --network goals-net mongo  
##########################//data persistence, add volume!
docker run --name mongodb -v data:/data/db -d --network goals-net mongo
##########################//data persistence + security
docker run --name mongodb -v data:/data/db -d -e MONGO_INITDB_ROOT_USERNAME=han -e MONGO_INITDB_ROOT_PASSWORD=secret --network goals-net mongo
##########################// if volume data available delete it first!
docker volume ls
docker volume rm data

##########################//build and run backend
docker build -t goals-node .
> docker run --name goals-backend --rm -d -p 80:80 --network goals-net goals-node 
or
> docker run --name goals-backend -v d:\Downloads\Udemy\Docker_and_Kubernetes\section5\multi-01-starting-setup\backend:/app -v logs:/app/logs -v /app/node_modules -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net goals-node


##########################//build and run front end
docker build -t goals-react .
docker run -v D:\Downloads\Udemy\Docker_and_Kubernetes\section5\multi-01-starting-setup\frontend\src:/app/src --name goals-frontend --rm -d -p 3000:3000 -it goals-react