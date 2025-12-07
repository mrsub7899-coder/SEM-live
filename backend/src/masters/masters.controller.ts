import {
  Controller,
  Get,
  Query,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Controller("masters")
export class MastersController {
  constructor(private prisma: PrismaService) {}

  @Get("search")
  async searchMasters(
    @Query("name") name?: string,
    @Query("sex") sex?: string,
    @Query("minLevel") minLevel?: string,
    @Query("page") page: string = "1",
    @Query("pageSize") pageSize: string = "18",
  ) {
    const filters: any = {
      role: "MASTER",
    };

    if (name) {
      filters.OR = [
        { name: { contains: name, mode: "insensitive" } },
        { email: { contains: name, mode: "insensitive" } },
      ];
    }

    if (sex) {
      filters.sex = sex;
    }

    if (minLevel) {
      filters.rankLevel = {
        gte: parseInt(minLevel),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);

    const [masters, total] = await Promise.all([
      this.prisma.user.findMany({
        where: filters,
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          rankLevel: true,
          sex: true,
        },
        orderBy: {
          rankLevel: "desc",
        },
        skip,
        take,
      }),
      this.prisma.user.count({ where: filters }),
    ]);

    return {
      results: masters,
      total,
      page: parseInt(page),
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
