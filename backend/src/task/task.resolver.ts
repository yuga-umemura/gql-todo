import { CreateTaskInput } from './dto/createTask.input';
import { Task } from './models/task_model';
import { TaskService } from './task.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // タスクがない場合は空の配列を返却（nullable: 'items)
  @Query(() => [Task], { nullable: 'items' })
  getTasks(): Task[] {
    return this.taskService.getTasks();
  }

  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput): Task {
    return this.taskService.createTask(createTaskInput);
  }
}
