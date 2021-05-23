import path from 'path';
import express from 'express';
import { userRoutes, groupRoutes, userGroupRoutes } from './routers';
import { userLogger, groupLogger, logInfo } from './utils/logger';

const PORT = process.env.SERVER_PORT;

const app = express();

// Configure Express to use EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes, logInfo(userLogger));
app.use('/groups', groupRoutes, logInfo(groupLogger));
app.use('/connections', userGroupRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost: ${PORT}`);
});
