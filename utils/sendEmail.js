require("dotenv").config();
const nodemailer = require("nodemailer");

const sendTicketEmail = async (email, name, location, date, price, qrCode) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: "BizzTech@gmail.com",
        to: email,
        subject: "Your Event Ticket",
        html: `
            <h3>Your Event Ticket</h3>
            <p>Thank you for your purchase! Below are the details of your ticket:</p>
            <ul>
                <li><strong>Event Name:</strong> ${name}</li>
                <li><strong>Location:</strong> ${location}</li>
                <li><strong>Date:</strong> ${date}</li>
                <li><strong>Price:</strong> ${price}</li>
            </ul>
            <p>QR Code:</p>
            <img src="${qrCode}" alt="QR Code" />
            <p>We look forward to seeing you at the event!</p>
            <p>Regards,</p>
            <p><strong>BizzTech Team</strong></p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
};

module.exports = { sendTicketEmail };

  