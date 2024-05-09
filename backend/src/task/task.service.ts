import { Task } from '@prisma/client';
import { PrismaService } from './../prisma/prisma.service';
import { CreateTaskInput } from './dto/createTask.input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}
  async getTasks(): Promise<Task[]> {
    return this.prismaService.task.findMany();
  }

  async createTask(createTaskInput: CreateTaskInput): Promise<Task> {
    const { name, dueDate, description } = createTaskInput;
    return await this.prismaService.task.create({
      data: {
        name,
        dueDate,
        description,
      },
    });
  }
}
