import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.js";
import farmersRoutes from "./src/routes/farmers.js";
import buyersRoutes from "./src/routes/buyers.js";
import donorsRoutes from "./src/routes/donors.js";
import deliveriesRoutes from "./src/routes/deliveries.js";
import donationsRoutes from "./src/routes/donations.js";

const app = express();
app.use(express.json());
app.use(cors());

// For serving frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "./frontend")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmersRoutes);
app.use("/api/buyers", buyersRoutes);
app.use("/api/donors", donorsRoutes);
app.use("/api/deliveries", deliveriesRoutes);
app.use("/api/donations", donationsRoutes);

// Fallback for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
