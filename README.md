# Blogish
It's a **blog-like toy project** where you can create an account, get a new blog, write a post, and browse others' blogs. The main goal for me was to get familiar with **React, Spring** and how to compose and connect all the microservices including FE, API server and DB.

<br>

## Demo
**You can watch full GIF demos on our [GitHub Wiki](https://github.com/BlackBindy/blogish/wiki).**

![Blogish demo sneak peek](https://user-images.githubusercontent.com/12558317/116883905-150e5c80-ac61-11eb-9658-02550c9a001e.gif)

<br>

## How to run?
### Prerequisites
- [Docker (Compose)](https://www.docker.com/)


<br>

### Using Docker Compose
```bash
$ git clone https://github.com/bb-in-hoodie/blogish.git
$ cd blogish
$ docker-compose up

# now you can access Blogish on your browser through http://localhost:3000
```

<br>

### Microservices
- blogish-client
  - front-end service (React)
  - build the front-end project with npm
  - serve the static files with NGINX
- blogish-server
  - web API service (Spring)
  - build and serve the back-end project with JDK
- blogish-mysql
  - DB service (mysql)

<br>

### Why don't you publish it on AWS or something?
Blogish has User CRUD features while its security is not guaranteed. That's why I don't serve it remotely and offers you a docker-compose file to make you run it locally.

<br>

## Features
- User
- Blog
- Post
- Category

<br>

## Used skills
### Front-end
- React
- Typescript
- Reactstrap
- NGINX

### Back-end
- Spring (boot) w/ Java
- MySQL

### Containerization
- Docker (Compose)

<br>
