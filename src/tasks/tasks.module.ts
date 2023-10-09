import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from '../typeorm/entities/task.entity';
import { TasksRepository } from '../typeorm/repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    providers: [TasksService, TasksRepository],
    controllers: [TasksController],
    imports: [
        TypeOrmModule.forFeature([Task]),
        AuthModule
    ],
    exports: [],
})
export class TasksModule { }
