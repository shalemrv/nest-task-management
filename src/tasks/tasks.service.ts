import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';

import { TasksRepository } from '../typeorm/repositories/tasks.repository';

import { Task } from '../typeorm/entities/task.entity';
import { TaskStatus } from '../models/task-status.enum';

import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { UpdateTaskDto } from '../tasks/dto/update-task.dto';
import { GetTasksFilterDto } from '../tasks/dto/get-tasks-filter.dto';
import { User } from '../typeorm/entities/user.entity';

@Injectable()
export class TasksService {
    
    private logger = new Logger('TasksService', { timestamp: true });

    constructor(
        @InjectRepository(TasksRepository) private tasksRepository: TasksRepository
    ) {}

    /**************************/
    // PUBLIC
    /**************************/

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return await this.tasksRepository.getTasks(filterDto, user);
    }

    // async allTasks(user: User): Promise<Task[]> {
    //     return await this.tasksRepository.find({
    //         where: { user }
    //     });
    // }

    // async searchTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    //     let {search, status} = filterDto;

    //     search = search? '%' + search + '%' : null;
    //     status = status ?? null;
        
    //     const filteredTasks = this.tasksRepository.createQueryBuilder('task');

    //     filteredTasks.where({ user });
        
    //     if (status)
    //         filteredTasks.andWhere(
    //             'status = :status',
    //             { status }
    //         );

    //     if (search)
    //         filteredTasks.andWhere(
    //             'task.title LIKE :search OR task.description LIKE :search',
    //             { search }
    //         );
        
    //     return await filteredTasks.getMany();
    // }

    async showTask(id: number, user: User): Promise<Task> {

        const task = await this.tasksRepository.findOneBy({ id, user });

        if(!task) 
            throw new NotFoundException(`No such task with ID - ${id}.`);

        return task;
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ) : Promise<Task> {
        const task = this.tasksRepository.create({
            user,
            ...createTaskDto,
            status: TaskStatus.OPEN
        });
        
        const saved = await this.tasksRepository.save(task);

        if (!saved)
            throw new BadRequestException('Unable to Add task.');

        return task;
    }

    async updateTask(
        id: number,
        updateTaskDto: UpdateTaskDto,
        user: User
    ) : Promise<Task> {

        const task = await this.showTask(id, user);
    
        const { title, description, status } = updateTaskDto; 
        
        task.title =  title;
        task.description =  description;
        task.status =  status;

        const saved = await this.tasksRepository.save(task);
        
        if(!saved)
            throw new BadRequestException('Unable to Update task.');

        return task;
    }

    async deleteTask(id: number, user: User): Promise<boolean> {

        const deletion = await this.tasksRepository.delete({ id, user });

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
    //         throw new NotFoundException(`No such task with ID - ${id}.`);

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
