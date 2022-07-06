const nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: '', // generated ethereal user
        pass: '', // generated ethereal password
    }
});


module.exports = {transport};



