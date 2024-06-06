import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'slowyou.net@gmail.com',
    pass: 'thuo hsxf fpco xgxt',
  },
});

router.get("/send-email", async (req, res) => {
    const { to, subject, text } = req.body;

    try {
        await transporter.sendMail({
            from: 'slowyou.net@gmail.com',
            to:'torarnehave@gmail.com',
            subject:'Mail fra SlowYou.net',
            text:'Dette er en test mail fra SlowYou.net'
        });

        res.send("Email sent successfully");
    } catch (error) {
        res.status(500).send("Error sending email: " + error.message);
    }
});

export default router;