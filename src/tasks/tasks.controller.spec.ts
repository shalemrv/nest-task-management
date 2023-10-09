import { Test } from "@nestjs/testing";

import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";

import { User } from "../typeorm/entities/user.entity";
import { Task } from "../typeorm/entities/task.entity";

import { TaskStatus } from "../models/task-status.enum";

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

const mockTasksService = () => ({
    getTasks: jest.fn(),
    findOneBy: jest.fn()
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

    // describe('store', () => {
    //     it(
    //         'should store new tasks of a user',
    //         async () => {
    //             const mockUser = mockUsers[0];
    //             const mockUserTasks = mockTasks.filter(task => task.user === mockUser);

    //             jest.spyOn(tasksService, 'getTasks').mockResolvedValue(mockUserTasks[0]);

    //             expect(await tasksController.index(null, mockUser)).toBe(mockUserTasks[0]);
    //         }
    //     );
    // });
});