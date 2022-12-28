import { Router } from 'express';
import SkillsController from '@/controllers/skills.controller';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { BulkCreateSkillDto, CreateSkillDto } from '@/dtos/skill.dts';
import authMiddleware from '@/middlewares/auth.middleware';

class DomainsRoute implements Routes {
    public path = '/skill';
    public router = Router();
    public skillsController = new SkillsController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, authMiddleware, this.skillsController.getSkills);
        this.router.post(`${this.path}`, authMiddleware, validationMiddleware(BulkCreateSkillDto, 'body'), this.skillsController.createSkill);
        this.router.get(`${this.path}/search/:id(\\d+)`, authMiddleware,this.skillsController.getSkillsByDomainID);
        this.router.put(`${this.path}/:id(\\d+)`, authMiddleware,validationMiddleware(CreateSkillDto, 'body'),this.skillsController.updateSkill);
        this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware,this.skillsController.deleteSkill);
    }
}

export default DomainsRoute;
