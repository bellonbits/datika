import { Controller, Get, Post, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EnrollmentsService } from './enrollments.service';

@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('my')
  @ApiOperation({ summary: 'Get all enrollments for the current student' })
  getMyEnrollments(@CurrentUser() user: { id: string }) {
    return this.enrollmentsService.getStudentEnrollments(user.id);
  }

  @Post(':enrollmentId/lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Mark a lesson as complete' })
  markLessonComplete(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string,
    @Param('lessonId', ParseUUIDPipe) lessonId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.enrollmentsService.markLessonComplete(enrollmentId, lessonId, user.id);
  }
}
