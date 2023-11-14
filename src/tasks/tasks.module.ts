import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard } from '@nestjs/throttler';

import { Task } from '../typeorm/entities/task.entity';
import { TasksRepository } from '../typeorm/repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    providers: [
        TasksService,
        TasksRepository,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    controllers: [TasksController],
    imports: [
        TypeOrmModule.forFeature([Task]),
        AuthModule
    ],
    exports: [],
})
export class TasksModule { }
