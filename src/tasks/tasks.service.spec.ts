import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TasksRepository } from '../typeorm/repositories/tasks.repository';

import { User } from '../typeorm/entities/user.entity';
import { Task } from '../typeorm/entities/task.entity';

import { TaskStatus } from '../models/task-status.enum';


const mockUsers: User[] = [
    {
        id: 41,
        username: 'Shalem',
        password: 'Something@321',
        tasks: []
    },
    {
        id: 42,
        username: 'Shalem',
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

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOneBy: jest.fn()
});

describe('Task Service', () => {
    let tasksService: TasksService;
    let tasksRepository: TasksRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockTasksRepository
                }
            ]
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it(
            'calls TasksRepository.getTasks and return Task[]',
            async () => {
                const mockUser = mockUsers[0];
                const mockUserTasks = mockTasks.filter(task => task.user === mockUser);

                jest.spyOn(tasksRepository, 'getTasks').mockResolvedValue(mockUserTasks);
                
                expect(await tasksService.getTasks(null, mockUser)).toEqual(mockUserTasks);
            }
        );
    });


    describe('showTask', () => {
        it(
            'calls tasksRepository.findOneBy and return Task',
            async () => {

                const mockUser = mockUsers[1];
                const mockUserTasks = mockTasks.filter(task => task.user === mockUser);

                jest.spyOn(tasksRepository, 'findOneBy').mockResolvedValue(mockUserTasks[0]);

                expect(await tasksService.showTask(2, mockUser)).toEqual(mockUserTasks[0]);
            }
        );

        it(
            'calls tasksRepository.findOneBy and handles an error',
            async () => {

                jest.spyOn(tasksRepository, 'findOneBy').mockResolvedValue(null);
                
                expect(tasksService.showTask(99, mockUsers[0])).rejects.toThrow(NotFoundException);
            }
        );
    });
});