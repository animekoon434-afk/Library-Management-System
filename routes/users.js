const express = require('express');
const {users} = require('../data/users.json');

const router = express.Router();


router.get('/',(req, res)=>{
    res.status(200).json({
        success : true,
        data : users
    })
});

router.get('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
       return res.status(404).json({
            success: false,
            message: `User Not Found with id ${id}`
        })
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

router.post('/', (req, res) => {
    const {id, name, surname, email, SubscriptionType, SubscriptionDate} = req.body;
    if(!id || !name || !surname || !email || !SubscriptionType || !SubscriptionDate){
        return res.status(400).json({
            success: false,
            message: 'Please provide all the required fields'
        });
    }

    const existingUser = users.find((each) => each.id === id);
    if(existingUser){
        return res.status(409).json({
            success: false,
            message: `User already exists with id ${id}`
        });
    }

    users.push({id, name, surname, email, SubscriptionType, SubscriptionDate});
    res.status(201).json({
        success: true,
        message: 'User added successfully',
        data: users
    });
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data}=  req.body;
    const user = users.find((each) => each.id === id);
    if(!user){
       return res.status(404).json({
            success: false,
            message: `User Not Found with id ${id}`
        })
    }
    const updatedUser = users.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data
            }
        }
        return each;
    });
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
    })    
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
       return res.status(404).json({
            success: false,
            message: `User Not Found with id ${id}`
        })
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: users
    })    
});

router.get('/subscription-details/:id', (req, res) => {
    const {id} = req.params;
    const user = users.find((each) => each.id === id);
    if(!user){
       return res.status(404).json({
            success: false,
            message: `User Not Found with id ${id}`
        })
    }
    // Calculate subscription end date
    const subscriptionStart = new Date(user.SubscriptionDate);
    let subscriptionLength = 0;
    if (user.SubscriptionType === 'Basic') subscriptionLength = 90;
    if (user.SubscriptionType === 'Standard') subscriptionLength = 180;
    if (user.SubscriptionType === 'Premium') subscriptionLength = 365;

    const subscriptionEnd = new Date(subscriptionStart);
    subscriptionEnd.setDate(subscriptionEnd.getDate() + subscriptionLength);

    const currentDate = new Date();
    const returnDate = new Date(user.returnDate);

    // Calculate days left
    let daysLeft = Math.max(0, Math.ceil((subscriptionEnd - currentDate) / (1000 * 60 * 60 * 24)));

    // Determine subscription status
    let subscriptionStatus = 'Active';
    if (currentDate > subscriptionEnd) {
        subscriptionStatus = 'Expired';
        daysLeft;
    }

    // Calculate fine if book returned after subscription expired
    let fine = 0;
    if (returnDate > subscriptionEnd) {
        const lateDays = Math.ceil((returnDate - subscriptionEnd) / (1000 * 60 * 60 * 24));
        fine = lateDays * 10; // fine per day
    }

    res.status(200).json({
        success: true,
        data: {
            ...user,
            subscriptionStatus,
            daysLeft,
            fine
        }
    })
});

module.exports = router;