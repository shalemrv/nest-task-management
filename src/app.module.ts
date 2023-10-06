import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
	imports: [
		AuthModule,
		TasksModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			port: 3306,
			username: 'root',
			password: '',
			database: 'task-management',
			autoLoadEntities: true,
			synchronize: true,
			logging: true
		})
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
