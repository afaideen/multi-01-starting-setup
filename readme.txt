

Section 5: Building Multi Container Apps with Docker
https://www.udemy.com/course/docker-kubernetes-the-practical-guide/learn/lecture/31793712#overview

References:
- https://www.mongodb.com/docs/manual/reference/connection-string/

-delate inactive docker images
    > docker image prune
##########################//create network and install then run mongodb
docker pull mongo
docker network ls
docker network create goals-net
docker run --name mongodb --rm -d -e MONGO_INITDB_ROOT_USERNAME=han -e MONGO_INITDB_ROOT_PASSWORD=secret --network goals-net mongo
docker start mongodb
docker network connect goals-net mongodb
-Check container mongodb running in which network
    > docker inspect mongodb
##########################//data persistence, add volume!
docker run --name mongodb -v data:/data/db -d --network goals-net mongo
##########################//data persistence + security
docker rm mongodb
docker run --rm --name mongodb -v data:/data/db -d -e MONGO_INITDB_ROOT_USERNAME=han -e MONGO_INITDB_ROOT_PASSWORD=secret --network goals-net mongo
##########################// if volume data available delete it first!
docker volume ls
docker volume rm data

##########################//build and run backend
cd backend
docker build -t goals-node .
docker tag goals-node afaideen/goals-node:latest
docker push afaideen/goals-node:latest
> docker run --name goals-backend -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net goals-node
> docker run --name goals-backend -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net afaideen/goals-node:latest
or
docker run --name goals-backend -v d:\Downloads\Udemy\Docker_and_Kubernetes\section5\multi-01-starting-setup\backend:/app -v logs:/app/logs -v /app/node_modules -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net goals-node
docker run --name goals-backend -v ./backend:/app -v logs:/app/logs -v /app/node_modules -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net goals-node
docker run --name goals-backend -v ./backend:/app -v logs:/app/logs -v /app/node_modules -e MONGODB_USERNAME=han -e MONGODB_PASSWORD=secret --rm -d -p 80:80 --network goals-net afaideen/goals-node:latest


##########################//build and run front end
docker build -t goals-react .
docker tag goals-react afaideen/goals-react:latest
docker push afaideen/goals-react:latest
docker run --name goals-frontend --rm -d -p 3000:3000 -it goals-react
docker run --name goals-frontend --rm -d -p 3000:3000 -it afaideen/goals-react:latest
docker run --name goals-frontend -v D:\Downloads\Udemy\Docker_and_Kubernetes\section5\multi-01-starting-setup\frontend\src:/app/src --rm -d -p 3000:3000 -it goals-react
docker run --name goals-frontend -v ./frontend/src:/app/src --rm -d -p 3000:3000 -it goals-react

Browse at http://139.162.44.216:3000/

