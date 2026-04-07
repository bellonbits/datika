import { Controller, Post, Get, Patch, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/lesson.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('section/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Create a lesson in a section' })
  create(
    @Param('sectionId', ParseUUIDPipe) sectionId: string,
    @Body() dto: CreateLessonDto,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.lessonsService.createLesson(sectionId, dto, user.id, user.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lesson content (enrollment required unless preview)' })
  getLesson(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.lessonsService.getLesson(id, user.id);
  }

  @Patch(':id')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiOperation({ summary: 'Update a lesson' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateLessonDto>,
    @CurrentUser() user: { id: string; role: Role },
  ) {
    return this.lessonsService.updateLesson(id, dto, user.id, user.role);
  }
}
