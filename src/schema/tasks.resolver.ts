import { Resolver, Query, Mutation, Arg } from "type-graphql";
import {
  completeAllResponse,
  PaginationInput,
  Task,
  TaskFilterArgs,
  TaskInput,
  TaskPage,
  UpdateTaskInput,
} from "./tasks.model";
import { v4 as uuidv4, validate } from "uuid";
import { ApolloError } from "apollo-server";

@Resolver(Task)
export class TasksResolver {
  public taskList: Task[] = [];

  //just for run test with context
  constructor(mockTasks?: Task[]) {
    if (mockTasks) {
      this.taskList = mockTasks;
    }
  }

  @Query(() => TaskPage)
  tasks(
    @Arg("filter", () => TaskFilterArgs, { nullable: true })
    filter: TaskFilterArgs,
    @Arg("pagination", () => PaginationInput, { nullable: true })
    pagination: PaginationInput
  ): { list: Task[]; page?: number; total?: number } {
    let filteredTasks = this.taskList;

    //Better separate this part
    if (filter) {
      if (filter.completed !== undefined) {
        filteredTasks = filteredTasks.filter(
          (task) => task.completed === filter.completed
        );
      }

      if (filter.startDueDate !== undefined) {
        const dueDateFrom = new Date(filter.startDueDate);
        if (!isNaN(dueDateFrom.getTime())) {
          filteredTasks = filteredTasks.filter(
            (task) => new Date(task.dueDate) >= dueDateFrom
          );
        }
      }

      if (filter.endDueDate !== undefined) {
        const dueDateTo = new Date(filter.endDueDate);
        if (!isNaN(dueDateTo.getTime())) {
          filteredTasks = filteredTasks.filter(
            (task) => new Date(task.dueDate) <= dueDateTo
          );
        }
      }
    }
    //for maximum flexabiliti in requests - we can provide only page or only limit, or do both, or don't provide any
    if (pagination && (pagination.page || pagination.limit)) {
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const total = Math.ceil(filteredTasks.length / limit) || 1; // in case if filteredTasks is empty
      //rest of validation duing in model
      if (page > total) {
        throw new ApolloError(
          `Invalid page number ${page}, must be between 1 and total pages: ${total}`,
          "INVALID_PAGE"
        );
      }
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
      return {
        list: paginatedTasks,
        total: total,
        page: page,
      };
    }

    return { list: filteredTasks, page: 1, total: 1 };
  }

  @Query(() => Task, { nullable: true })
  task(@Arg("id", { validateFn: idValidation }) id: string): Task {
    let task = this.taskList.find((task) => task.id === id);
    if (!task) {
      if (!task) {
        //Maybe the error here is not necessary, we could just return null, but let's keep it.
        throw new ApolloError(`Task with id ${id} not found`, "TASK_NOT_FOUND");
      }
      return task;
    }
    return task;
  }

  @Mutation(() => Task)
  createTask(@Arg("taskFields", () => TaskInput) taskFields: TaskInput): Task {
    //in this task, using uuid, I don't see any reason check for duplicates id
    const newTask = { id: uuidv4(), ...taskFields };
    this.taskList.push(newTask);
    return newTask;
  }

  @Mutation(() => completeAllResponse)
  completeAll(): completeAllResponse {
    //just return number of completed tasks
    return this.taskList.reduce(
      (acc, task) => {
        if (task.completed) {
          return acc;
        } else {
          task.completed = true;
          return { ...acc, completed: acc.completed + 1 };
        }
      },
      { completed: 0 }
    );
  }

  //separate input object for update, so we can specify just fields that we want to update
  @Mutation(() => Task)
  updateTask(
    @Arg("id", { validateFn: idValidation }) id: string,
    @Arg("updateFields", () => UpdateTaskInput) updateFields: UpdateTaskInput
  ): Task | null {
    const index = this.taskList.findIndex((task) => task.id === id);
    if (index === -1) {
      //if we send some id to update, we expect that task with this id exists
      throw new ApolloError(
        `Update error: Task with id ${id} not found`,
        "TASK_NOT_FOUND"
      );
    }
    this.taskList[index] = { ...this.taskList[index], ...updateFields };
    return this.taskList[index];
  }

  @Mutation(() => Task)
  deleteTask(@Arg("id", { validateFn: idValidation }) id: string): Task | null {
    const index = this.taskList.findIndex((task) => task.id === id);
    if (index === -1) {
      //if we send some id to delete, we expect that task with this id exists
      throw new ApolloError(
        `Delete error: Task with id ${id} not found`,
        "TASK_NOT_FOUND"
      );
    }
    const [deletedTask] = this.taskList.splice(index, 1);
    return deletedTask;
  }
}

//UUID validation
function idValidation(id: string): void {
  if (!validate(id))
    throw new ApolloError(`Task id ${id} not valid`, "UUID_NOT_VALID");
}
