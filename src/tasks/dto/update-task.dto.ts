import { TaskStatus } from "src/models/task-status.enum";
import { IsNotEmpty, IsEnum } from "class-validator";
export class UpdateTaskDto {

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    description: string;
    
    @IsEnum(TaskStatus)
    status: TaskStatus
}