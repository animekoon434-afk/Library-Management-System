const express = require('express');

//  importing routes

const usersRouter = require('./routes/users.js');
const booksRouter = require('./routes/books.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message : 'Home Page :-'})
});

app.use('/users', usersRouter);

app.use('/books', booksRouter);




// app.all("/*", (req,res)=>{
//     res.status(500).json({message : 'Not Built Yet'})
// });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
