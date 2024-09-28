import express, { Express, Request, Response } from "express";

const router = express.Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ all: new Date().getTime() });
});

export default router;
