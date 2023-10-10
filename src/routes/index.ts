import { Router } from "express";
import * as controller from "../controllers/index";
import { newOrder } from './../controllers/newOrder';
import { callbackEndpoint } from './../controllers/callbackEndpoint';

export const index = Router();

index.get("/", controller.index);
index.post('/api/v1/order', newOrder);
index.patch('/api/v1/callback/:id', callbackEndpoint);
