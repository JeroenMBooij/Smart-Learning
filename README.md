# Smart-Learning with teacher Didac

<img src="https://github.com/JeroenMBooij/Smart-Learning/blob/main/Images/didac.jpg"></img>

The goal of this project is to build an app that combines my previous projects, Handwriting & Speech recognition, Single sign-on and the Email Service in a microservice architecture maintained with Kubernetes. With this app users have the abillty to create, configure, learn and share flash cards. The time between learning flashcards is based on the users learning curve attached to the card, which is calculated with the <a href='https://www.supermemo.com/en/archives1990-2015/english/ol/sm2' target='_blank'> SuperMemo 2 spaced repetition algorithm </a> and depends on feedback given to the card and the time it takes to answer the flashcard. Furthermore the app provides insight into the users learning retention with leaderboards and data visualisation. </br></br>

<h1>Architecture</h1>
The application consists of an Angular frontend, which you can find in the App folder, and two .NET 5.0 Web API. One API is a Hangfire.io scheduler for scheduling the flashcards and the other API is for managing the flashcards. Managing the flashcards depends on three microservices listed below. </br></br>
<h3> Microservice Repositories </h3>
<ul>
  <li><a href="https://github.com/JeroenMBooij/JWT-SSO-Authentication">Authentication Service (.NET 5.0)</a></li>
  <li><a href="https://github.com/JeroenMBooij/Email-Service">Email Service (.NET 5.0)</a></li>
  <li><a href="https://github.com/JeroenMBooij/Transcribing_Neural_Networks">Transcribing Neural Network Service (Django)</a></li>
</ul>


<h1>Usage</h1>
This application supports deployment with Docker Compose or Kubernetes. For Kubernetes please see the <a href="https://github.com/JeroenMBooij/Smart-Learning/tree/main/Helm">Helm Charts</a> in this repository </br></br>

<h3>Docker Compose</h3>
* prerequisite - docker installed <br/><br/>
  
<b>steps</b>
  <p> 1. Override secrets in docker-compose with a docker-compose.vs.debug.yml file or define the secrets as environment variables in your pipeline</p>
  <p> 2. run docker-compose -f docker-compose.yml -f docker-compose.override.yml -f docker-compose.vs.debug.yml up -d</p>
</br>

This repository also builds a docker image for the Angular app, but is only used in Kubernetes. For local development in Angular please use ng serve. </br>

<b>docker-compose.vs.debug.yml example file</b>

```

version: '3.8'

services:

      
  teacherdidac.web:
    environment:
      AUTH_SERVER_URL: http://teacherdidac.authentication

      
  teacherdidac.scheduler:
    environment:
      DB_HOST: teacherdidac.db
      DB_NAME: ScheduleDb
      DB_USER: root
      DB_PASSWORD: secretKeY12345678!@34
      HANGFIRE_USER: admin
      HANGFIRE_PASSWORD: test


  teacherdidac.authentication:
    environment:
      DB_HOST: teacherdidac.db
      DB_NAME: IdentityDb
      DB_USER: root
      DB_PASSWORD: secretKeY12345678!@34
      JWT_SECRETTKEY: [your secret PKCS #8 key]
      JWT_ISSUER: [You]
      EMAIL_APPKEY: [Your google email app key]
      

  teacherdidac.db:
    environment:
      MYSQL_ROOT_PASSWORD: secretKeY12345678!@34
      
```
