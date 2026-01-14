import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { MilestonesModule } from './milestones/milestones.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    AuthModule,
    CommonModule,
    UsersModule,
    ProjectsModule,
    MilestonesModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
