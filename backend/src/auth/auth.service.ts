import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * REGISTER USER
   */
  async register(data: {
    email: string;
    password: string;
    name: string;
    role?: 'USER' | 'MASTER';
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashed,
        name: data.name,
        role: data.role ?? 'USER',
        credits: 0,
      },
    });

    return user;
  }

  /**
   * LOGIN USER
   */
  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return { token, user };
  }
}
