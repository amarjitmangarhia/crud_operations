//import express
const express = require("express");

// import router from express to define routes
const router = express.Router();

// importing Model which is defined in model file which includes schema
const Model = require("../model")

function formatDate(isoDateString) {
    // Creating an array of month names
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Creating a Date object from the ISO string
    const date = new Date(isoDateString);
    date.setUTCHours(0, 0, 0, 0); 

    const day = date.getUTCDate();
    const month = date.getUTCMonth(); 
    const year = date.getUTCFullYear();

    // Format the date as "day month year"
    const formattedDate = `${day} ${monthNames[month]} ${year}`;

    return formattedDate;
}


// add user route
router.get("/addUser", (req, res) => {
    res.render("addUser");
});

// route to send post request to mongodb to store user
router.post("/addUser", async (req, res) => {
    // console.log(req.body)

    
    const user = new Model({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        address1: req.body.address1,
        address2: req.body.address2 ? req.body.address2 : "n/a",
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        userNotes: req.body.userNotes
    })

    try {
        const tryToSaveUser = await user.save()
        res.status(200).render("Success");
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
})


// fetch all user list from database

router.get("/", async (req, res) => {
    
    const findAllUser = await Model.find();


    const updatedUser = findAllUser.map((user) => {
        return {
            // ...user,
            dateOfBirth: formatDate(user.dateOfBirth),
            firstName: user.firstName,
            lastName: user.lastName,
            address1: user.address1,
            address2: user.address2,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            phoneNumber: user.phoneNumber,
            email: user.email,
            userNotes: user.userNotes,
            _id: user.id

        };
    });



    res.render('AllUsers', {findAllUser: updatedUser});
})

// edit user detail route

router.get("/editUser/:id", async (req, res) => {

    const id = req.params.id
    const findById = await Model.findById(id)

    res.render("EditUser", {findById})
})



router.post("/editUser/:id", async (req, res) => {
    
    const id = req.params.id
    try {
    const findById = await Model.findByIdAndUpdate(id, {
        $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            userNotes: req.body.userNotes
        },
    }, {new: true}
    )
    if (!findById) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).render("Success");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
})

//delete user from database

router.get("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const deletedUser = await Model.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User with ID ${id} deleted successfully`);
        res.status(200).render("Success")
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router