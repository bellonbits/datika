import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { CoursesAiService } from './courses-ai.service';

@Module({
  providers: [CoursesService, CoursesAiService],
  controllers: [CoursesController],
  exports: [CoursesService, CoursesAiService],
})
export class CoursesModule {}
