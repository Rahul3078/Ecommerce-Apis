import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config()

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {

        user: process.env.USER,
        pass: process.env.PASS
    }
})

// export const sendEmail = async ({ to, subject, html, text }) => {
//     try {
//         const info = await transporter.sendMail({
//             from: process.env.USER,
//             to,
//             subject,
//             html,
//             text

//         });
//         console.log("Email sent :", info.response)
//         return true;
//     } catch (error) {
//         console.error("Error sending email :", err);
//         return false
//     }
// }


export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.USER,
            to,
            subject,
            text,
            html
        })
        console.log("email sent:", info.response);
    }
    catch (error) {
        console.log(error);
    }
}