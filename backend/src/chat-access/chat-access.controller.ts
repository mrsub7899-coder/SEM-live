import {
  Controller,
  Post,
  Req,
  Body,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from '../prisma.service';
// ✅ Import your custom Roles decorator
import { Roles } from '../auth/roles.decorator';

@Controller('chat-access')
@UseGuards(AuthGuard('jwt'))
export class ChatAccessController {
  constructor(private prisma: PrismaService) {}

  /**
   * BUY CHAT ACCESS
   */
  @Post('buy')
  async buyChatAccess(
    @Req() req,
    @Body() body: { masterId: string },
  ) {
    const userId = req.user.id;
    const masterId = body.masterId;

    if (!masterId) {
      throw new Error('masterId is required');
    }

    if (userId === masterId) {
      throw new Error('You cannot buy chat access to yourself');
    }

    // Fetch master + user
    const [master, user] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: masterId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    if (!master) {
      throw new Error('Master not found');
    }

    if (master.role !== 'MASTER') {
      throw new Error('This user is not a master');
    }

    const price = master.chatPrice ?? 0;

    // Check if user already has access
    const existing = await this.prisma.chatAccess.findFirst({
      where: { userId, masterId },
    });

    if (existing) {
      return { message: 'Chat access already purchased' };
    }

    // Check credits
    if (user.credits < price) {
      throw new Error(
        `Not enough credits. Required: ${price}, Available: ${user.credits}`,
      );
    }

    // Atomic transaction
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: price } },
      });

      const access = await tx.chatAccess.create({
        data: {
          userId,
          masterId,
          // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return access;
    });

    return {
      message: 'Chat access purchased successfully',
      access: result,
      pricePaid: price,
    };
  }

  /**
   * SET CHAT PRICE (Masters only)
   */
  @Roles('MASTER')
  @Post('set-price')
  async setChatPrice(
    @Req() req,
    @Body() body: { price: number },
  ) {
    const masterId = req.user.id;

    if (body.price < 0) throw new Error('Price must be positive');

    await this.prisma.user.update({
      where: { id: masterId },
      data: { chatPrice: body.price },
    });

    return { message: 'Chat price updated', price: body.price };
  }
}
