import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { configValidateSchema } from './config-validation.schema';

@Module({
	imports: [
		AuthModule,
		TasksModule,
		ConfigModule.forRoot({
			envFilePath: [
				`.env.stage.${process.env.STAGE}`
			],
			validationSchema: configValidateSchema
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				return {
					type: 'mysql',
					host: configService.get('DB_HOST') ?? 'localhost',
					port: configService.get('DB_PORT') ?? 3306,
					username: configService.get('DB_USERNAME') ?? 'root',
					password: configService.get('DB_PASSWORD') ?? '',
					database: configService.get('DB_NAME') ?? 'task-management',
					autoLoadEntities: true,
					synchronize: true
				};
			}
		})
	],
	controllers: [],
	providers: [],
})
export class AppModule { }