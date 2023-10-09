import { TaskStatus } from "../../models/task-status.enum";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class GetTasksFilterDto {

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;
}