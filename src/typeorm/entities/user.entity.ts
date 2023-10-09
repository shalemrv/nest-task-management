import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Task } from './task.entity';

@Entity({
    name: 'users'
})
export class User {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @OneToMany(
        () => Task,
        (task) => task.user,
        {
            eager: true
        }
    )
    tasks: Task[];
}