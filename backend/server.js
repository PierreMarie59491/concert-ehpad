// concerts-ehpad-backend/server.js
import express from "express";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// ⚡ CORS : autoriser uniquement ton frontend Vercel
app.use(cors({
  origin: "https://concert-ehpad-wwfp-m2n4n0cvq-pierremars-projects.vercel.app", // <--- URL exacte
  methods: ["GET", "POST"]
}));

// ⚡ Static files (si jamais tu as un frontend léger côté backend)
app.use(express.static(path.join(__dirname, "public")));

// --- ROUTES ---
// // Landing page (optionnel si Vercel sert le frontend)
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Get testimonials
app.get("/testimonials", (req, res) => {
  const filePath = path.join(__dirname, "data", "testimonials.json");
  const testimonials = JSON.parse(fs.readFileSync(filePath));
  res.json(testimonials);
});

// Post new testimonial
app.post("/testimonials", (req, res) => {
  const { structure, message, date } = req.body;
  if (!structure || !message || !date) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  const filePath = path.join(__dirname, "data", "testimonials.json");
  const testimonials = JSON.parse(fs.readFileSync(filePath));
  testimonials.push({ structure, message, date });
  fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2));

  res.json({ success: true });
});

// Contact form via Nodemailer
app.post("/contact", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Champs obligatoires manquants" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou ton SMTP pro
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "Nouveau message via site concerts Ehpad",
      text: `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || "N/A"}\n\nMessage:\n${message}`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur d’envoi" });
  }
});

// --- Lancer le serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Backend lancé sur http://localhost:${PORT}`);
});
