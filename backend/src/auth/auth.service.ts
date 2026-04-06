import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  tokens: TokenPair;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        role: Role.STUDENT,
      },
    });

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account is deactivated');

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async googleAuth(googleUser: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<AuthResult> {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.avatarUrl,
          googleId: googleUser.googleId,
          emailVerified: true,
          role: Role.STUDENT,
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId, emailVerified: true },
      });
    }

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, tokens };
  }

  async refreshTokens(refreshToken: string): Promise<TokenPair> {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: delete old, issue new
    await this.prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await this.generateTokens(stored.user);
    await this.saveRefreshToken(stored.userId, tokens.refreshToken);
    return tokens;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Cannot change password for OAuth accounts');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId, token: refreshToken },
    });
  }

  private async generateTokens(user: User): Promise<TokenPair> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async saveRefreshToken(userId: string, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.refreshToken.create({ data: { userId, token, expiresAt } });
  }
}
