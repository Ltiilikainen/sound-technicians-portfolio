# Sound Technician's Portfolio
A portfolio website for a sound technician

"npm i" to install all required dependencies, "npm run dev" to start the server in development mode. Default port: 3000
Port config:  /src/server/main.ts line 179

## Features
- MongoDB integration for displaying and updating site content
- Mailjet integration to receive contact requests through the website
- Custom audio player
- Hidden endpoint /login for access to content admin features

 ### MongoDB setup
 Schemas can be found in /src/server/Schemas

 two databases: site-content and user
 .env has two different roles and passowords defined: 
 - DB_WRITER: has read/write access to all databases
 - DB_READER: has read access to all/only site-content

#### Setting up admin
Admin has no registering currently, so in order to set up an admin user, it needs to be initialised directly into the database with
username: regular string
password: argon2 hashed string

dbConnectors middleware: 
- connectReader() connects only to site-content
- connectWriter() takes in a string argument for database name and can therefore connect to both site-content and user

## Files folder
for correct saving and deleting of files, the following folder structure is required in /src:
files
     |
     |- img
     |- work-audio

### Admin features
- Add, edit and delete references
- Add, edit and delete work examples
- Add, edit and delete equipment

### Planned features (currently unsupported)
- Adding, editing and deleting calendar bookings
- Adding calendar bookings to equipment
- Deleting images from references and equipment during edit
- Visual overhaul
- Session-based authentication and login system
- Admin forgotten password reset option
- Video support

  

  
