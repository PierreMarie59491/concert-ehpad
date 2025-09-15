import express from "express";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("tiny"));

// CORS : seulement ton frontend Vercel
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));

const DATA_FILE = path.join(__dirname, "data", "testimonials.json");

// ------------------
// API — Testimonials
// ------------------
app.get("/api/testimonials", (req, res) => {
  try {
    const testimonials = JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
    res.json(testimonials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de lire les avis" });
  }
});

app.post("/api/testimonials", (req, res) => {
  const { structure, message, date } = req.body;
  if (!structure || !message || !date) return res.status(400).json({ error: "Champs manquants" });

  try {
    const testimonials = JSON.parse(fs.readFileSync(DATA_FILE, "utf8") || "[]");
    testimonials.unshift({ structure, message, date }); // dernier en premier
    fs.writeFileSync(DATA_FILE, JSON.stringify(testimonials, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur en sauvegarde" });
  }
});

// ------------------
// API — Contact
// ------------------
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "Champs manquants" });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `Nouveau message site - ${name}`,
      text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || "N/A"}\n\nMessage:\n${message}`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'envoi du mail" });
  }
});

// Health check (optionnel)
app.get("/healthz", (req, res) => res.send("ok"));

// Lancer le serveur
app.listen(PORT, () => console.log(`🚀 Backend lancé sur le port ${PORT}`));
