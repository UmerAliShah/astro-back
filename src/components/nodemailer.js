const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

module.exports = async (data) => {
  console.log(data, "data");
  try {
    // create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "  ",
      // auth: {
      //   user: "umerali@fabtechsol.com",
      //   pass: "",
      // },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send a welcome email to the new user
    const mailOptions = {
      from: "umerali@fabtechsol.com",
      to: data.email,
      subject: "Flash Book Production",
      html: `<p>You have submitted a book one of our team member will review it and get back to you shortly ${data}<p/>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
