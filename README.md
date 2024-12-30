# Chat-App
A web app for chatting. You can create chat rooms or join an existing one and chat away.
This documentation provides an overview of the project, including setup instructions, features, and usage guidelines.

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Contributing](#contributing)
5. [Tech Stack](#tech-stack)

## Introduction
A realtime chat app where you can join a room or create one. It has an user friendly for a pleasant user experience.

## Installation

  ### Prequisites
    - Node.js 
    - npm

  - Clone the repository using   `git clone https://github.com/vknir/Chat-App.git`
  
  ### Frontend
  1. Navigate to frontend directory using `cd ./root/frontend`
  2. Install all the dependencies using   `npm i`
  3. Run the frontend using   `npm run start`
  4. Open the browser and goto [http://loacalhost:5173](http://localhost:5173) 

  ### Backend
  Its not necessary to run backend locally for this app get working, but a local backend is a lot faster so heres how you do it.
    
    1. Navigate to backend directory using `cd ./root/backend`
    2. Install all dependencies using   `npm i`
    3. Run the backend using `npm run dev`.

## Usage
1. Open your brwser and navigate to http://localhost:5173
2. Create a room or join an existing room (room creation may take some time if you are using the hosted backend, for a faster experience start the /backend locally and replace the backend url with http://localhost/3000).
3. Chat away.

## Contributing
Everone's welcome to contribute to this project. To contribute follow these steps:

1. Fork the repository.
2. Create a new branch
   `git checkout -b feature-name `
3. Push to the branch
    `git push origin feature-name`
4. Create a pull request on GitHub      

    

## Tech Stack
1. Frontend
   - [React](https://react.dev/)
2. Backend
   - [Node.js](https://nodejs.org/en)
   - [Express.js](https://expressjs.com/)
   - [WebSockets](https://www.npmjs.com/package/ws)
   
