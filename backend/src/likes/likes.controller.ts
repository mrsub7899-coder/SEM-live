import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PrismaService } from "../prisma.service";
import { RankService } from "../rank/rank.service";

@Controller("likes")
@UseGuards(AuthGuard("jwt"))
export class LikesController {
  constructor(
    private prisma: PrismaService,
    private rankService: RankService,
  ) {}

  @Post()
  async likeMaster(
    @Req() req,
    @Body() body: { masterId: string },
  ) {
    const userId = req.user.id;
    const { masterId } = body;

    // prevent self-like & duplicates as needed
    await this.prisma.masterLike.create({
      data: {
        userId,
        masterId,
      },
    });

    // ✅ award RP to master
    await this.rankService.addRankPoints(masterId, 10);

    return { message: "Master liked, rank points awarded." };
  }
}
