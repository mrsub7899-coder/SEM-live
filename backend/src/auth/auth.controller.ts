import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * REGISTER
   */
  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role?: 'USER' | 'MASTER';
    },
  ) {
    const user = await this.authService.register(body);
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * LOGIN
   */
  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
  ) {
    const { token, user } = await this.authService.login(body);
    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * GET CURRENT USER
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req) {
    return req.user;
  }

  /**
   * GET PROFILE
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async profile(@Req() req) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        credits: true,
        name: true,
      },
    });
    return user;
  }

  /**
   * TOP UP CREDITS
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('credits/topup')
  async topupCredits(
    @Req() req,
    @Body() body: { amount: number },
  ) {
    if (body.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const updated = await this.prisma.user.update({
      where: { id: req.user.id },
      data: { credits: { increment: body.amount } },
      select: { credits: true },
    });

    return {
      message: 'Credits topped up successfully',
      credits: updated.credits,
    };
  }
}
