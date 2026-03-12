import nodemailer from "nodemailer";
import { env } from "../config/env.config.js";

let transporter;

const getTransporter = () => {
  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    const error = new Error("Email credentials are not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // usa STARTTLS
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
      connectionTimeout: 5000, // 5 seconds
    });
  }

  return transporter;
};

export const sendPasswordResetEmail = async (to, token, baseUrl) => {
  const appUrl = baseUrl || env.APP_BASE_URL || "http://localhost:8080";
  const resetLink = `${appUrl}/api/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: env.EMAIL_FROM || env.EMAIL_USER,
    to,
    subject: "Password reset",
    text: `You requested a password reset. Use this link to set a new password:\n${resetLink}\n\nThis link can be used only once.`,
  };

  const mailer = getTransporter();
  await mailer.sendMail(mailOptions);
};
