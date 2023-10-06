import { TaskStatus } from "src/models/task-status.enum";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
    name: 'tasks'
})
export class Task {

    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.OPEN
    })
    status: TaskStatus;
}