import { NextFunction, Request, Response } from 'express';
import { Skills } from '@prisma/client';
import skillService from '@/services/skills.service';
import { CreateSkillDto } from '@/dtos/skill.dts';
import MessageBroker from "@integrations/rabbitmq.integration";

class SkillsController {
  public skillService = new skillService();
  public broker = MessageBroker.getInstance();

  public getSkills = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllSkillsData: Skills[] = await this.skillService.findAllSkills();

      res.status(200).json({ data: findAllSkillsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getSkillsByDomainID = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const domainID = Number(req.params.id);
      const { search } = req.query;
      console.log(search);
      let findAllSkillsData: any;
      if (search) {
        findAllSkillsData = await this.skillService.searchSkill(domainID, String(search));
      } else {
        findAllSkillsData = await this.skillService.findSkillByDomainId(domainID);
      }

      res.status(200).json({ data: findAllSkillsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public createSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skillData: CreateSkillDto[] = req.body.data;
      const createSkillData: Skills = await this.skillService.createSkill(skillData);
      (await this.broker).send('create_skill', Buffer.from(JSON.stringify(createSkillData)))

      res.status(201).json({ data: createSkillData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skillId = Number(req.params.id);
      const skillData: CreateSkillDto = req.body;
      const updateSkillData: Skills = await this.skillService.updateSkill(skillId, skillData);
      const messageData = { "id": skillId, "data": skillData };
      (await this.broker).send('update_skill', Buffer.from(JSON.stringify(messageData)))
      res.status(200).json({ data: updateSkillData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSkill = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const skillId = Number(req.params.id);
      const deleteSkillData: Skills = await this.skillService.deleteSkill(skillId);
      (await this.broker).send('delete_skill', Buffer.from(JSON.stringify(skillId)))
      res.status(200).json({ data: deleteSkillData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default SkillsController;
