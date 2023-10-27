export default function (req, res) {
    let nodemailer = require('nodemailer')
    const transporter = nodemailer.createTransport({
       /* port: 587,
        host: "smtp.office365.com",*/
        service: "gmail",
        auth: {
            user: process.env.EMAILSENDER,
            pass: process.env.PASSWORDSENDER,
        },
    });

    const mailData = {
        from: 'magson@gmail.com',
        to: `${req.body.email}`,
        subject: `Message From ${req.body.name}`,
        text: req.body.message
    }
    transporter.sendMail(mailData, function (err, info) {
        if(err){
           console.error(error)
        } else {
            console.log("Email Enviado:wq");
             res.send.code(200);
         }

    })
}