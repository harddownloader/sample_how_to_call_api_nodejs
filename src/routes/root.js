import express from 'express';
import { newOrder } from '../controllers/root/newOrder';
import { callbackEndpoint } from '../controllers/root/callbackEndpoint';

const root = express.Router()

root.get('/', (req, res) => res.status(200).send('api works'))
root.post('/api/v1/order', newOrder)
root.patch('/api/v1/callback/:id', callbackEndpoint)

export default root