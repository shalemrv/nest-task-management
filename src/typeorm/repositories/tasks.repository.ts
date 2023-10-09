import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';


import { Task } from '../../typeorm/entities/task.entity';
import { GetTasksFilterDto } from '../../tasks/dto/get-tasks-filter.dto';

import { User } from '../entities/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {

    private logger = new Logger('TasksRepository', { timestamp: true });

    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    private logGenericTaskFetch(
        filterDto: GetTasksFilterDto,
        user: User
    ) {
        const userLogInfo = `\nUser - ${user.id} - ${user.username}`;
        const filterLog = '\n' + JSON.stringify(filterDto, null, 3);

        let logMessage = `Fetching all tasks ${userLogInfo}`;
        
        if (Object.keys(filterDto).length > 0)
            logMessage = `Fetching filtered tasks of ${filterLog} ${userLogInfo}`;

        logMessage = '\n\n' + logMessage;

        this.logger.verbose(logMessage);
    }

    private logSqlError(error: any): void {
        const sqlLog = `\n\nSQL Executed \n ${error.driverError.sql}\n\n`;

        const errorLog = '\n' + JSON.stringify(error, null, 3);
            
        this.logger.error(`Error while fetching tasks ${sqlLog} ${errorLog}`, error.stack);
    }

    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User
    ): Promise<Task[]> {

        let { search, status } = filterDto;
        
        search = search ? '%' + search + '%' : null;
        
        status = status ?? null;

        const filteredTasksQuery = this.createQueryBuilder('task');

        filteredTasksQuery.andWhere({ user });

        if (status)
            filteredTasksQuery.andWhere(
                'status = :status',
                { status }
            );

        if (search)
            filteredTasksQuery.andWhere(
                '(task.title LIKE :search OR task.description LIKE :search)',
                { search }
            );


        // Logging
        this.logGenericTaskFetch(filterDto, user);

        try {
            const filteredTasks = await filteredTasksQuery.getMany(); 
            
            return filteredTasks;

        } catch (error) {

            this.logSqlError(error);

            throw new InternalServerErrorException('Something went wrong while fetching tasks');
        }
        
    }

}