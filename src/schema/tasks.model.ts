import { Field, ObjectType, InputType, ID } from "type-graphql";
import { Length, IsBoolean, IsDateString, IsUUID, Min } from "class-validator";
import { v4 as uuidv4 } from "uuid";


/*After some research, I decided to go with type-graphql, so I don't need to write types separately.
and also it's provides validation
Also better if I seprate some part in other file, but this project not so big
*/

@InputType()
export class TaskInput {
  @Field()
  @Length(1, 100)
  title!: string;

  @Field({ nullable: true })
  @Length(1, 500)
  description?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  completed!: boolean;

  @Field()
  @IsDateString()
  dueDate!: string;

  constructor(
    title: string,
    dueDate: string,
    description?: string,
    completed: boolean = false
  ) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.completed = completed;
  }
}

@InputType()
export class TaskFilterArgs {
  @Field({ nullable: true })
  @IsBoolean()
  completed?: boolean;

  @Field({ nullable: true })
  @IsDateString()
  startDueDate?: string;

  @Field({ nullable: true })
  @IsDateString()
  endDueDate?: string;
}

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  @Min(1, { message: "Page must be greater than or equal to 1" })
  page?: number;
  @Field({ nullable: true })
  @Min(1, { message: "Limit must be greater than or equal to 1" })
  limit?: number;
}

@ObjectType()
export class Task {
  @Field(() => ID)
  @IsUUID()
  id: string = uuidv4();

  @Field()
  @Length(1, 100)
  title!: string;

  @Field({ nullable: true })
  @Length(1, 500)
  description?: string;

  @Field({ defaultValue: false })
  @IsBoolean()
  completed!: boolean;

  @Field()
  @IsDateString()
  dueDate!: string;

  constructor(
    id: string,
    title: string,
    dueDate: string,
    description?: string,
    completed: boolean = false
  ) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.completed = completed;
  }
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @Length(1, 100)
  title?: string;

  @Field({ nullable: true })
  @Length(1, 500)
  description?: string;

  @Field({ nullable: true })
  @IsBoolean()
  completed?: boolean;

  @Field({ nullable: true })
  @IsDateString()
  dueDate?: string;
}

@ObjectType()
export class TaskPage {
  @Field(() => [Task])
  list!: Task[];

  @Field({ nullable: true })
  page?: number;

  @Field({ nullable: true })
  total?: number;
}

@ObjectType()
export class completeAllResponse {
  @Field()
  completed!: number;
}
