import { body } from "express-validator";

export const scheduleValidation = [
  body("name").isLength({ min: 2 }),
  body("content").isObject(),
];
