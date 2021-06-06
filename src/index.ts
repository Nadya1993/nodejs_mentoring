import express from 'express';
import { userRoutes, groupRoutes, userGroupRoutes, authRoutes } from './routers';
import { userLogger, groupLogger, logInfo, logError } from './utils/logger';
import { checkToken } from './routers/controllers/authControllers';
import cors from 'cors';

const PORT = process.env.SERVER_PORT;

const app = express();
const corsOptions = {
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
}

app.use(cors(corsOptions));
// либо можно вот так настроить корсы:
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'callid, authorization, content-type, x-finger-print, X-Device-FingerPrint'
//   );
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/oauth2/token', authRoutes, logError(userLogger));

app.use('*', checkToken);

app.use('/users', userRoutes, logInfo(userLogger), logError(userLogger));
app.use('/groups', groupRoutes, logInfo(groupLogger), logError(groupLogger));
app.use('/connections', userGroupRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost: ${PORT}`);
});
