import { NextFunction, Request, Response } from 'express';
import MessageBroker from "@integrations/rabbitmq.integration";

class IndexController {
  public index = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const broker = MessageBroker.getInstance();
      (await broker).send('test', Buffer.from(JSON.stringify("hi")))
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
