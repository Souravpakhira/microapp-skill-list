import { PrismaClient, DomainMaster } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { CreateDomainDto } from '@/dtos/domain.dts';

class DomainService {
  public domain = new PrismaClient().domainMaster;

  public async findAllDomain(): Promise<DomainMaster[]> {
    const allDomain = await this.domain.findMany({where:{deletedAt:null}});
    return allDomain;
  }

  public async findDomainById(domainId: number): Promise<DomainMaster> {
    if (isEmpty(domainId)) throw new HttpException(400, "Domain Id is empty");

    const findDomain: DomainMaster = await this.domain.findUnique({ where: { id: domainId } });
    if (!findDomain) throw new HttpException(409, "User doesn't exist");

    return findDomain;
  }

  public async createDomain(domainData: CreateDomainDto): Promise<DomainMaster> {
    if (isEmpty(domainData)) throw new HttpException(400, "domainData is empty");

    const findDomain: DomainMaster = await this.domain.findFirst({ where: { name: domainData.name } });
    if (findDomain) throw new HttpException(409, `This ${domainData.name} already exists`);

    const createDomainData: DomainMaster = await this.domain.create({ data: { ...domainData } });
    return createDomainData;
  }

  // public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
  //   if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

  //   const findUser: User = await this.users.findUnique({ where: { id: userId } });
  //   if (!findUser) throw new HttpException(409, "User doesn't exist");

  //   const hashedPassword = await hash(userData.password, 10);
  //   const updateUserData = await this.users.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
  //   return updateUserData;
  // }

  public async deleteDomain(domainId: number): Promise<DomainMaster> {
    if (isEmpty(domainId)) throw new HttpException(400, "User doesn't existId");

    const findDomain: DomainMaster = await this.domain.findUnique({ where: { id: domainId } });
    if (!findDomain) throw new HttpException(409, "Domain doesn't exist");
    const deleteDomainData = await this.domain.update({ where: { id: domainId }, data: { ...findDomain, deletedAt: new Date() } });
    return deleteDomainData;
  }
}

export default DomainService;
