const express = require('express');
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books
    })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === parseInt(id));
    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book Not Found with id ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
});

router.post('/', (req, res) => {
    const { id, title, author, genre, price, publisher } = req.body;
    if (!id || !title || !author || !genre || !price || !publisher) {
        return res.status(400).json({
            success: false,
            message: 'Please provide id, title, author and genre of the book'
        });
    }

    const existingBook = books.find((each) => each.id === parseInt(id) || each.title === title || each.author === author);

    const reason = [];

    if (existingBook) {
        if (existingBook.id === parseInt(id)) {
            reason.push(`id ${id}`);
        }
        if (existingBook.title === title) {
            reason.push(`title "${title}"`);
        }
        if (existingBook.author === author) {
            reason.push(`author "${author}"`);
        }
        if (reason.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: `Book already exists with ${reason.join(' and ')}` 
            });
        }
    }

    const newBook = { id, title, author, genre, price, publisher };
    books.push(newBook);
    res.status(201).json({
        success: true,
        data: books
    })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {data} = req.body;
    const book = books.find((each) => each.id === parseInt(id));

    if(!data || Object.keys(data).length === 0){
       return res.status(400).json({
            success:  false,
            message : "Please provide data to update"
        })
    }

    if (!book) {
        return res.status(404).json({
            success: false,
            message: `Book Not Found with id ${id}`
        });
    }
    
    const updatedBook = books.map((each) => {
        if (each.id === parseInt(id)) {
            return {
                ...each,
                ...data
            }
        }
        return each;
    });
    res.status(200).json({
        success: true,
        data: updatedBook
    });
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const booksIndex = books.findIndex((each) => each.id === parseInt(id));
    console.log(booksIndex);
    if(booksIndex === -1){
        return res.status(404).json({
            success: false,
            message: `Book Not Found with id ${id}`
        });
    }
    books.splice(booksIndex, 1);
    res.status(200).json({
        success: true,
        data: books
    });
});

router.get('/issued/by-user' , (req, res) => {
    const issuedBooks = users.filter((user) => user.issuedBooks > 0);

    const userIssuedBooks = [];

    issuedBooks.forEach((each) => {
        const book = books.find((b) => b.id === parseInt(each.issuedBooks));

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        userIssuedBooks.push(book);
    });

    if(userIssuedBooks.length === 0){
        return res.status(404).json({
            success: false,
            message: 'No books are issued by any user'
        });
    }
    res.status(200).json({
        success: true,
        data: userIssuedBooks
    });
});


module.exports = router;