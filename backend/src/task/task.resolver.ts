import { Task } from './models/task_model';
import { TaskService } from './task.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // タスクがない場合は空の配列を返却（nullable: 'items)
  @Query(() => [Task], { nullable: 'items' })
  getTasks(): Task[] {
    return this.taskService.getTasks();
  }
}
