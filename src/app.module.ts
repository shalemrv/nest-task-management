import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		TasksModule,
		TypeOrmModule.forRoot({
			type: 'mysql',
			port: 3306,
			username: 'root',
			password: '',
			database: 'task-management',
			autoLoadEntities: true,
			synchronize: true,
			logging: false
		}),
		AuthModule
	],
	controllers: [],
	providers: [],
})
export class AppModule { }
