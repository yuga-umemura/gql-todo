import { Task } from '@prisma/client';
import { CreateTaskInput } from './dto/createTask.input';
import { Task as TaskModel } from './models/task_model';
import { TaskService } from './task.service';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  // タスクがない場合は空の配列を返却（nullable: 'items)
  @Query(() => [TaskModel], { nullable: 'items' })
  async getTasks(): Promise<Task[]> {
    return await this.taskService.getTasks();
  }

  @Mutation(() => TaskModel)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ): Promise<Task> {
    return await this.taskService.createTask(createTaskInput);
  }
}
