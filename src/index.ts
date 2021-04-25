import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import { suggestionRoutes, userRoutes } from './routers';

dotenv.config();

const PORT = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', suggestionRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost: ${PORT}`);
});
