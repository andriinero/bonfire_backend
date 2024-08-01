<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<div align="center">
<h3 align="center">Bonfire Backend</h3>

  <p align="center">
    REST API web server written in TypeScript utilizing Express.js and MongoDB
    <br />
    <a href="https://bonfire-an.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/andriinero/bonfire">Frontend</a>
    ·
    <a href="https://github.com/andriinero/bonfire_backend/issues/new">Report Bug</a>
    ·
    <a href="https://github.com/andriinero/bonfire_backend/issues/new">Suggestion</a>  </p>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#api-endpoints">API Endpoints</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project
### Features
- Users: authentication and authorization are implemented to manage users
- Chat Rooms: create and read chat rooms
- Participants: create and read participants
- Messages: create and read messages
- Contacts: create, read and delete contacts

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### API Endpoints
Note that some endpoints may require proper authentication or authorization.

#### Authentication Endpoints
- GET `/api/auth/data`
- POST `/api/auth/sign-in`
- POST `/api/auth/sign-up`

#### Chat Room Endpoints
- Chat Rooms
  - GET `/api/chat-rooms`
  - POST `/api/chat-rooms`
- Participants
  - GET `/api/chat-rooms/:chatroomid/participants`
  - POST `/api/chat-rooms/:chatroomid/participants`
- Messages
  - GET `/api/chat-rooms/:chatroomid/messages`
  - POST `/api/chat-rooms/:chatroomid/messages`

#### Profile Endpoints
- Contacts
  - GET `/api/profile/contacts`
  - POST `/api/profile/contacts`
  - DELETE `/api/profile/contacts/:userid`

#### Page Count Endpoints
- Chat Rooms
  - GET `/api/chat-rooms/page-count`
- Participants 
  - GET `/api/chat-rooms/:chatroomid/participants/page-count`
- Messages
  - GET `/api/chat-rooms/:chatroomid/messages/page-count`
- Contacts
  - GET `/api/profile/contacts/page-count`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
- [![Neovim][Neovim]][Neovim-url]
- [![TypeScript][TypeScript]][TypeScript-url]
- [![Node.js][NodeJS]][NodeJS-url]
- [![Express.js][Express]][Express-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [![JWT][JWT]][JWT-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->

## Getting Started
To get a local copy up and running follow these example steps.
### Prerequisites
To run this server, you'll need your own Atlas account and database connection string, as well as NodeJS installed on your machine.

You can create and set up your own account at [MongoDB Atlas](https://www.mongodb.com/en-us/cloud/atlas/register) official website. Note that while Atlas may offer you paid plan, the free tier cluster should be more than enough for development purposes.
As for NodeJS you can visit [NodeJS installation guide](https://nodejs.org/en/download/package-manager) on the official website.

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/andriinero/bonfire_backend.git
   ```
2. Create `.env` file in your project's root directory and paste the following
   ```sh
    HOSTNAME=localhost
    PORT=3000
    CORS_ORIGIN=http://localhost:5174
    # connection string is very important
    MONGODB_URI=<YOUR_ATLAS_CONNECTION_STRING>
    JWT_SECRET=SECRET
    JWT_EXP=1000000
    BCRYPT_SALT_VALUE=1
    JET_LOGGER_MODE=CONSOLE
    JET_LOGGER_FILEPATH=jet-logger.log
    JET_LOGGER_TIMESTAMP=TRUE
    JET_LOGGER_FORMAT=LINE
    MAX_DOCS_PER_FETCH=25
   ```
    *NOTE: you can omit angle brackets and delete the comments*

3. Install NPM packages
   ```sh
   npm install
   ```
4. After installing packages you can start your local server
   ```sh
   npm run dev
   ```
   
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTRIBUTING -->

## Contributing
Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[Neovim]: https://img.shields.io/badge/NeoVim-%2357A143.svg?&style=for-the-badge&logo=neovim&logoColor=white
[Neovim-url]: https://neovim.io/
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[JWT]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens
[JWT-url]: https://jwt.io/introduction
[NodeJS]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org/
[Express]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
