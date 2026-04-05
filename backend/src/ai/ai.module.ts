import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { NotesService } from './notes/notes.service';
import { QuizService } from './quiz/quiz.service';
import { GradingService } from './grading/grading.service';
import { ChatService } from './chat/chat.service';

@Module({
  controllers: [AiController],
  providers: [NotesService, QuizService, GradingService, ChatService],
  exports: [GradingService],
})
export class AiModule {}
