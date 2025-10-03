# Library-Management-System

    This is a library management API Backend for the mangement of users and the books

# Routes and the Endpoints

## /user
GET:  Get all the list of users in the system
POST: Create/Register a new user

##  /user/{id}
GET: Get a user by thier ID
PUT: Updatind a user bgy their ID
DELETE: Deleting a user by their ID (check if the user still  has an issued book) && (is there any fine/penalty to collected)

## /user/subscription-details/{id}
GET: Get a user subcription details by their ID
    >> Date of subscription
    >> Valid till ?
    >> Fine if any ?

## /books
GET: Get all the books in the system
POST: Add a new book to the system

## /books/{id}
GET: Get a book by it's ID
PUT: Update a book by it's ID
DELETE: Delete a book by it's ID

## /books/issued
GET: Get all the issued books

## /books/issued/withFile
GET: Get all issued books with their fine amount

### Subscription Types
    >> Basic (3  months)
    >> Standard (6 months)
    >> Premium (12 months)

>> If a user missed the renewal date and still didn't return the issued book then user should be collected with 10$ per day after the expiry of the subscription 
>> If a user misses the renewal date and does not return the issued book, a fine of $10 per day will be charged after the expiry of the subscription.

##  Commands:
npm init
npm i express
npm i nodemon -D

npm run dev