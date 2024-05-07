import { Injectable } from '@nestjs/common';
import { Task } from './models/task_model';

@Injectable()
export class TaskService {
  tasks: Task[] = [];

  getTasks(): Task[] {
    const task1 = new Task();
    task1.id = 1;
    task1.name = 'task1';
    task1.dueDate = '2023-01-01';
    task1.status = 'NOT_STARTED';
    this.tasks.push(task1);
    return this.tasks;
  }
}
