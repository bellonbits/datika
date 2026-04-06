import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new student account' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return { data: result, message: 'Account created successfully' };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return { data: result, message: 'Login successful' };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(dto.refreshToken);
    return { data: tokens, message: 'Tokens refreshed' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  async logout(
    @CurrentUser() user: User,
    @Body() dto: RefreshTokenDto,
  ) {
    await this.authService.logout(user.id, dto.refreshToken);
    return { data: null, message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async me(@CurrentUser() user: User) {
    const { passwordHash: _, ...safeUser } = user as User & { passwordHash?: string };
    return { data: safeUser, message: 'User profile retrieved' };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password for authenticated user' })
  async changePassword(
    @CurrentUser() user: User,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    await this.authService.changePassword(user.id, body.currentPassword, body.newPassword);
    return { data: null, message: 'Password changed successfully' };
  }

  // ─── Google OAuth ────────────────────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  googleAuth() {
    // Passport handles redirect
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleAuth(req.user as {
      googleId: string;
      email: string;
      name: string;
      avatarUrl?: string;
    });
    const frontendUrl = this.config.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const params = new URLSearchParams({
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
    res.redirect(`${frontendUrl}/auth/callback?${params.toString()}`);
  }
}
