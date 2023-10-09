import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnprocessableEntityException, UseGuards, Logger } from '@nestjs/common';
import { GetUser } from '../auth/get-user.decorator';
import { TasksService } from './tasks.service';
import { Task } from '../typeorm/entities/task.entity';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { User } from '../typeorm/entities/user.entity';

import { AuthGuard } from '@nestjs/passport'

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {

    private logger = new Logger('TasksController', { timestamp: true });

    constructor(private tasksService: TasksService) {}

    @Get('/')
    public index(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ) : Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:taskId')
    show(
        @Param('taskId') taskId: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.showTask(taskId, user);
    }

    @Post('/')
    store(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Put('/:id')
    update(
        @Param('id') id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTask(id, updateTaskDto, user);
    }

    @Delete('/:id')
    async delete(
        @Param('id') id: number,
        @GetUser() user: User
    ): Promise<string> {
        const isDeleted = await this.tasksService.deleteTask(id, user);

        if (!isDeleted)
            throw new UnprocessableEntityException(`Unable to delete task with ID - ${id}.`);

        return `Successfully deleted task with ID - ${id}.`;
    }
}
