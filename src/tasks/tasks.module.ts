import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from 'src/typeorm/entities/task.entity';
import { TasksRepository } from '../typeorm/repositories/tasks.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
    providers: [TasksService, TasksRepository],
    controllers: [TasksController],
    imports: [
        TypeOrmModule.forFeature([Task])
    ],
    exports: [],
})
export class TasksModule { }
