import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { TasksRepository } from '../typeorm/repositories/tasks.repository';

import { Task } from 'src/typeorm/entities/task.entity';
import { TaskStatus } from 'src/models/task-status.enum';

import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { UpdateTaskDto } from 'src/tasks/dto/update-task.dto';
import { GetTasksFilterDto } from 'src/tasks/dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    
    constructor(
        @InjectRepository(TasksRepository) private taskRepository: Repository<Task>
    ) {}

    /**************************/
    // PUBLIC
    /**************************/

    async allTasks(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    async searchTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        let {search, status} = filterDto;

        search = search? '%' + search + '%' : null;
        status = status ?? null;

        const filteredTasks = this.taskRepository.createQueryBuilder('task');

        
        if (status)
            filteredTasks.andWhere(
                'status = :status',
                { status }
            );

        if (search)
            filteredTasks.andWhere(
                'task.title LIKE :search OR task.description LIKE :search',
                { search }
            );
        
        return await filteredTasks.getMany();
    }

    async showTask(id: number): Promise<Task> {

        const task = await this.taskRepository.findOneBy({ id });

        if(!task) 
            throw new NotFoundException('No such task');

        return task;
    }

    async createTask(createTaskDto: CreateTaskDto) : Promise<Task> {
        const task = this.taskRepository.create({
            ...createTaskDto,
            status: TaskStatus.OPEN
        });
        
        const saved = await this.taskRepository.save(task);

        if (!saved)
            throw new BadRequestException('Unable to Add task.');

        return task;
    }

    async updateTask(id: number, updateTaskDto: UpdateTaskDto) : Promise<Task> {

        const task = await this.taskRepository.findOneBy({ id });

        if (!task) 
            throw new NotFoundException('No such task.');
    
        const { title, description, status } = updateTaskDto; 
        
        task.title =  title;
        task.description =  description;
        task.status =  status;

        const saved = await this.taskRepository.save(task);
        
        if(!saved)
            throw new BadRequestException('Unable to Update task.');

        return task;
    }

    async deleteTask(id: number): Promise<boolean> {

        const deletion = await this.taskRepository.delete({ id });

        if (!deletion || deletion.affected === 0)
            throw new NotFoundException(`No such task with ID - ${id}.`);

        return true;
    }




















    
    // private tasks: Task[] = [
    //     {
    //         id: '1',
    //         title: 'Task 1',
    //         description: 'This is Task 1',
    //         status: TaskStatus.OPEN
    //     },
    //     {
    //         id: '2',
    //         title: 'Task 2',
    //         description: 'This is Task 2',
    //         status: TaskStatus.IN_PROGRESS
    //     }
    // ];
    
    // private getTasksFromStorage(): Task[] {
    //     return this.tasks;
    // }

    // private getTasksWithFiltersFromStorage(filterDto: GetTasksFilterDto): Task[] {
    //     const {status, search} = filterDto;

    //     let tasks = [...this.tasks];

    //     if (search){
    //         tasks = tasks.filter((task) => {
    //             return task.title.includes(search) || task.description.includes(search);
    //         });
    //     }

    //     if (status) {
    //         tasks = tasks.filter(task => task.status == status);
    //     }

    //     return tasks;
    // }

    // private addTaskToStorage(task: Task): boolean {
    //     this.tasks.push(task);
    //     return true;
    // }

    // private getTaskDetailsById(id: string): [number, Task] {
        
    //     let index = -1;

    //     const filteredTasks = this.tasks.filter((task, i) => {
    //         if (task.id != id)
    //             return false;

    //         index = i;
    //         return true;
    //     })

    //     if (index === -1) 
    //         throw new NotFoundException('No such task');

    //     return [index, filteredTasks[0]];
    // }

    // private updateTaskAtIndexInStorage(index: number, task: Task): boolean {
    //     this.tasks[index] = task;
    //     return true;
    // }

    // private deleteTaskFromStorage(id: string): Task {
    //     const taskDetails = this.getTaskDetailsById(id);

    //     this.tasks = this.tasks.filter(task => task.id != id);

    //     return taskDetails[1];
    // }
}
