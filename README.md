> A vuejs-sales-project
    
This is an example sales VueJS project for a travel agency

## Build Setup

``` bash
# install dependencies
npm install

# client with hot reload at localhost:8080
npm run dev

# server with hot reload at localhost:8080
npm start

# Create new user in MongoDB

Insert into collection 'users' a new user admin to access the system:

{
    "_id" : ObjectId("5c9ad841c081da9539f5dd15"),
    "status" : "ACTIVE",
    "name" : "Anonymous",
    "profile" : "ADMIN",
    "email" : "teste@teste.com",
    "nickName" : "Anony",
    "password" : "$2a$08$iqt1SlSIz/ppcFqEmoM9M.3Ari.Xc3fAVSpo5U0jTBRrkXIIk9KTm",
    "cpfCnpj" : 1,
    "__v" : 0
}

The password hash is: pass@12345