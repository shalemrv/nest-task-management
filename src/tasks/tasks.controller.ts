import { Body, Controller, Delete, Get, Param, Post, Put, Query, UnprocessableEntityException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from 'src/typeorm/entities/task.entity';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {

    constructor(private tasksService: TasksService) {}

    @Get('/')
    public index(@Query() filterDto: GetTasksFilterDto) : Promise<Task[]> {

        if (Object.keys(filterDto).length > 0)
            return this.tasksService.searchTasks(filterDto);

        return this.tasksService.allTasks();
    }

    @Get('/:taskId')
    show(@Param('taskId') taskId: number): Promise<Task> {
        return this.tasksService.showTask(taskId);
    }

    @Post('/')
    store(
        @Body() createTaskDto: CreateTaskDto
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }

    @Put('/:id')
    update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto): Promise<Task> {
        return this.tasksService.updateTask(id, updateTaskDto);
    }

    @Delete('/:id')
    async delete(@Param('id') id: number): Promise<string> {
        const isDeleted = await this.tasksService.deleteTask(id);

        if (!isDeleted)
            throw new UnprocessableEntityException(`Unable to delete task with ID - ${id}.`);

        return `Successfully deleted task with ID - ${id}.`;
    }
}
