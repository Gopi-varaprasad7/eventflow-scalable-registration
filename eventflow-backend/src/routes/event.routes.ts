import express from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import router from './user.routes';
import { createEventHandler ,getEventsHandler,registerEventHandler} from '../controllers/event.controller';
const app = express.Router();

app.use('/create-event',authenticate,createEventHandler);
app.use('/my-events',authenticate,getEventsHandler);
app.use('/register-event',authenticate,registerEventHandler);

export default router;