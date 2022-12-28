import { Router } from 'express';
import DomainsController from '@/controllers/domain.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateDomainDto } from '@/dtos/domain.dts';
import authMiddleware from '@/middlewares/auth.middleware';

class DomainsRoute implements Routes {
    public path = '/domain';
    public router = Router();
    public domainsController = new DomainsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, this.domainsController.getDomains);
        this.router.post(`${this.path}`, authMiddleware, validationMiddleware(CreateDomainDto, 'body'), this.domainsController.createDomain);
        // this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateUserDto, 'body', true), this.usersController.updateUser);
        this.router.delete(`${this.path}/:id(\\d+)`, this.domainsController.deleteDomain);
    }
}

export default DomainsRoute;
