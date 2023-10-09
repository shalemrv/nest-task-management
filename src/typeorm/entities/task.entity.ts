import { TaskStatus } from "../../models/task-status.enum";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from "./user.entity";
import { Exclude } from 'class-transformer';

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

    @ManyToOne(
        () => User,
        user => user.tasks,
        { eager : false }
    )
    @Exclude({
        toPlainOnly: true
    })
    user: User;
}