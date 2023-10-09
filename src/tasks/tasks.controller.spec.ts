import { Test } from "@nestjs/testing";
import { NotFoundException } from '@nestjs/common';

import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

import { User } from "../typeorm/entities/user.entity";
import { Task } from "../typeorm/entities/task.entity";

import { TaskStatus } from "../models/task-status.enum";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

const mockUsers: User[] = [
    {
        id: 41,
        username: 'Shalem',
        password: 'Something@321',
        tasks: []
    },
    {
        id: 42,
        username: 'Rathna Raj',
        password: 'Something@321',
        tasks: []
    },
]

const mockTasks: Task[] = [
    {
        id: 1,
        title: 'Do something 1',
        description: 'Just Do it',
        status: TaskStatus.OPEN,
        user: mockUsers[0]
    },
    {
        id: 2,
        title: 'Do something 2',
        description: 'Just Do it 2',
        status: TaskStatus.IN_PROGRESS,
        user: mockUsers[1]
    }
];

const mockTasksService = () => ({
    getTasks: jest.fn(),
    showTask: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
});

describe('TasksConstroller', () => {
    let tasksService: TasksService;
    let tasksController: TasksController;

    beforeEach(async () => {
        
        const moduleRef = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [{
                provide: TasksService,
                useFactory: mockTasksService
            }],
        }).compile();

        tasksService = moduleRef.get<TasksService>(TasksService);
        tasksController = moduleRef.get<TasksController>(TasksController);
    });

    describe('index', () => {
        it(
            'should return all tasks of a user',
            async () => {
                const mockUser = mockUsers[0];
                const mockUserTasks = mockTasks.filter(task => task.user === mockUser);

                jest.spyOn(tasksService, 'getTasks').mockResolvedValue(mockUserTasks);

                expect(await tasksController.index(null, mockUser)).toBe(mockUserTasks);
            }
        );
    });

    describe('show', () => {
        it(
            'calls tasksService.showTask and return Task',
            async () => {

                const mockUser = mockUsers[1];
                const mockUserTasks = mockTasks.filter(task => task.user === mockUser);

                jest.spyOn(tasksService, 'showTask').mockResolvedValue(mockUserTasks[0]);
                
                expect(await tasksController.show(2, mockUser)).toEqual(mockUserTasks[0]);
            }
        );

        it(
            'calls tasksService.showTask and handles an error',
            async () => {

                jest.spyOn(tasksService, 'showTask').mockRejectedValue(new NotFoundException);
                
                expect(tasksController.show(99, mockUsers[0])).rejects.toThrow(NotFoundException);
            }
        );
    });

    describe('store', () => {
        it(
            'should store new tasks of a user',
            async () => {
                const mockUser = mockUsers[0];
                const mockNewTaskDto: CreateTaskDto = {
                    title: 'Do Something new',
                    description: 'Just do it'
                };

                jest.spyOn(tasksService, 'createTask').mockResolvedValue(mockTasks[0]);

                expect(await tasksController.store(mockNewTaskDto, mockUser)).toBe(mockTasks[0]);
            }
        );
    });

    describe('update', () => {
        it(
            'should update existing task of a user',
            async () => {
                const mockUser = mockUsers[0];
                const mockUpdateTaskDto: UpdateTaskDto = {
                    title: 'Do Something new',
                    description: 'Just do it',
                    status: TaskStatus.DONE
                };

                jest.spyOn(tasksService, 'updateTask').mockResolvedValue(mockTasks[0]);

                expect(await tasksController.update(41, mockUpdateTaskDto, mockUser)).toBe(mockTasks[0]);
            }
        );
    });

    describe('delete', () => {
        it(
            'should delete existing task of a user',
            async () => {
                const mockUser = mockUsers[0];
                const deleteTaskId = 1;

                jest.spyOn(tasksService, 'deleteTask').mockResolvedValue(true);

                expect(await tasksController.delete(deleteTaskId, mockUser)).toBe(`Successfully deleted task with ID - ${deleteTaskId}.`);
            }
        );
    });

});