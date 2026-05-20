import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import problemRoutes from "./routes/problem.route.js"; // Rotaları import ettik
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); 
app.use(express.static('public'));

// Rotaları sisteme dahil ediyoruz
app.use("/api/problems", problemRoutes);

// Swagger Dokümantasyonu Kurulumu
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Sunucu ${PORT} portunda tıkır tıkır çalışıyor!`);
    });
})
.catch((err) => {
    console.log("Sunucu başlatılamadı!", err);
});