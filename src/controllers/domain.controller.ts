import { NextFunction, Request, Response } from 'express';
import { DomainMaster } from '@prisma/client';
import domainService from '@/services/domain.service';
import { CreateDomainDto } from '@/dtos/domain.dts';

import MessageBroker from "@integrations/rabbitmq.integration";


class DomainsController {
  public domainService = new domainService();
  public broker = MessageBroker.getInstance();

  public getDomains = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllDomainsData: DomainMaster[] = await this.domainService.findAllDomain();

      res.status(200).json({ data: findAllDomainsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };


  public createDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const domainData: CreateDomainDto = req.body;
      const createDomainData: DomainMaster = await this.domainService.createDomain(domainData);
      (await this.broker).send('create_domain', Buffer.from(JSON.stringify(createDomainData)))

      res.status(201).json({ data: createDomainData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  //   public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //     try {
  //       const userId = Number(req.params.id);
  //       const userData: CreateUserDto = req.body;
  //       const updateUserData: User = await this.userService.updateUser(userId, userData);

  //       res.status(200).json({ data: updateUserData, message: 'updated' });
  //     } catch (error) {
  //       next(error);
  //     }
  //   };

  public deleteDomain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const domainId = Number(req.params.id);
      const deleteDomainData = await this.domainService.deleteDomain(domainId);

      res.status(200).json({ data: deleteDomainData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default DomainsController;
