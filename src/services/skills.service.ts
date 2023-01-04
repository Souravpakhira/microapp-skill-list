import { Prisma, PrismaClient, Skills } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateSkillDto } from '@/dtos/skill.dts';

class SkillService {
  public skill = new PrismaClient().skills;
  public domain = new PrismaClient().domainMaster;
  public prisma = new PrismaClient();

  public async findAllSkills(): Promise<Skills[]> {
    const allDomain: Skills[] = await this.skill.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        DomainMaster: true
      }
    });
    return allDomain;
  }

  public async findSkillByDomainId(domainId: number): Promise<any> {
    if (isEmpty(domainId)) throw new HttpException(400, "Domain Id is empty");

    const findDomain = await this.domain.findMany({ where: { id: domainId }, include: { skills: true } })
    if (!findDomain) throw new HttpException(409, "Domain doesn't exist");

    return findDomain;
  }

  public async searchSkill(domainId: number, search: string): Promise<any> {
    if (isEmpty(domainId)) throw new HttpException(400, "Domain Id is empty");

    const findDomain = await this.skill.findFirst({
      where: {
        AND: {
          domainMasterId: domainId,
          name: { contains: search }
        }
      }
    })
    if (!findDomain) throw new HttpException(200, "Skills doesn't exist");

    return findDomain;
  }

  public async createSkill(skillData: Array<CreateSkillDto>): Promise<any> {
    if (isEmpty(skillData)) throw new HttpException(400, "skillData is empty");

    // const createSkillData:Prisma.BatchPayload = await this.skill.createMany({ data: skillData });

    const createSkillData = this.prisma.$transaction(
      skillData.map((skill) => this.skill.create({ data: skill })),
    );

    return createSkillData;
  }

  public async updateSkill(skillId: number, skillData: CreateSkillDto): Promise<Skills> {
    if (isEmpty(skillData)) throw new HttpException(400, "skillData is empty");

    const findSkill: Skills = await this.skill.findUnique({ where: { id: skillId } });
    if (!findSkill) throw new HttpException(409, "Skill doesn't exist");

    const updateSkillData = await this.skill.update({ where: { id: skillId }, data: { ...skillData } });
    return updateSkillData;
  }

  public async deleteSkill(skillId: number): Promise<Skills> {
    if (isEmpty(skillId)) throw new HttpException(400, "Skill doesn't exist Id");

    const findSkill: Skills = await this.skill.findUnique({ where: { id: skillId } });
    if (!findSkill) throw new HttpException(409, "Skill doesn't exist");

    const deleteSkillData = await this.skill.update({ where: { id: skillId }, data: { ...findSkill, deletedAt: new Date() } });
    return deleteSkillData;
  }
}

export default SkillService;
