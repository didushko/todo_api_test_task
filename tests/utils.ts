import { graphql, GraphQLSchema } from "graphql";
import { buildSchema, Maybe } from "type-graphql";
import { TasksResolver } from "../src/schema/tasks.resolver";
import { Task } from "../src/schema/tasks.model";
import { Container } from "typedi";

// cash resolver data and prepere some requests
export const createGqlClient = async (defaultData?: Task[]) => {
  const resolver = new TasksResolver(defaultData);
  Container.set(TasksResolver, resolver);
  const schema = await buildSchema({
    resolvers: [TasksResolver],
    validate: true,
    container: Container,
  });

  return async (
    source: string,
    variableValues?: Maybe<{ readonly [variable: string]: unknown }>
  ) =>
    graphql({
      schema,
      source,
      variableValues,
      contextValue: { resolver },
    });
};

export const createMutation = `mutation ($title: String!, $completed: Boolean = false) {
  createTask(taskFields: {
    title: $title
    description: "create task test"
    completed: $completed
    dueDate: "2025-02-01"
  }) {
    id
    title
    completed
    description
    dueDate
  }
}`;

export const updateMutation = `mutation ($id: String!, $updateFields: UpdateTaskInput!) {
  updateTask(id: $id, updateFields:  $updateFields) {
    id
    title
    description
    completed
    dueDate
  }
}`;

export const findByIdQuery = `
query Query ($id: String!) {
  task(id: $id) {
    id  
    title
  }
}`;

export const findQuery = `query Query($filter: TaskFilterArgs) {
  tasks(filter: $filter) {
    list {
      id
      title
      description
      completed
      dueDate
    }
    page
    total
  }
}`;

export const defaultData = [
  {
    id: "481af2b9-92ad-4bc6-85ac-33ddac527bc4",
    title: "create task test 1738274324289",
    completed: false,
    description: "create task test",
    dueDate: "2025-02-05",
  },
  {
    id: "481af2b9-92ad-4bc6-85ac-33ddac527bc5",
    title: "create task test 1738274324289",
    completed: false,
    description: "create task test",
    dueDate: "2025-02-01",
  },
  {
    id: "481af2b9-92ad-4bc6-85ac-33ddac527bc6",
    title: "create task test 1738274324289",
    completed: false,
    description: "create task test",
    dueDate: "2025-02-01",
  },
  {
    id: "481af2b9-92ad-4bc6-85ac-33ddac527bc7",
    title: "create task test 1738274324289",
    completed: false,
    description: "create task test",
    dueDate: "2025-02-01",
  },
  {
    id: "481af2b9-92ad-4bc6-85ac-33ddac527bc8",
    title: "create task test 1738274324289",
    completed: true,
    description: "create task test",
    dueDate: "2025-02-01",
  },
];
