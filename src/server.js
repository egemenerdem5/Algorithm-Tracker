import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import problemRoutes from './routes/problem.route.js';
import { connectDB } from './config/db.js';

const app = express();
const PORT = 8000;
const swaggerDocument = yaml.load('./swagger.yaml');

app.use(express.json());
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/problems', problemRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`🚀 Server is successfully running on port ${PORT}!`);
    console.log(`📄 Swagger API documentation available at http://localhost:${PORT}/api-docs`);
});