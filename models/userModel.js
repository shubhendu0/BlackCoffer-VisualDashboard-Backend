const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
    {
        name : {
            type: String,
            required: [true, "Please provide name"]
        },
        email : {
            type: String,
            required: [true, "Please provide unique email"],
            unique: [true, "This email is already in use"],
            validate: [isEmail, 'invalid email']
        },
        password : {
            type: String,
            required: [true, "Please provide password"],
            minlength: [6, "Password is weak."]
        },
        photo: {
            type: String,
            required: [true, "Please add a photo"],
            default: "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg",
        },
        userAgent: {
            type: Array,
            required: true,          
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("users", userSchema);
module.exports = User;

