import "reflect-metadata";
import { createMutation, findByIdQuery, createGqlClient } from "./utils";
import { Task } from "../src/schema/tasks.model";
import { TasksResolver } from "../src/schema/tasks.resolver";

describe("Create task", () => {
  it("should create a task", async () => {
    const run = await createGqlClient();
    const title = "create task test " + Date.now();

    const res = (await run(createMutation, { title }))?.data
      ?.createTask as Task;
    expect(res.title).toEqual(title);
    expect(res.id).toBeDefined();
    const res2 = (await run(findByIdQuery, { id: res.id }))?.data?.task as Task;
    expect(res2.id).toEqual(res.id);
    expect(res2.title).toEqual(title);
  });

  it("should throw validation error", async () => {
    const run = await createGqlClient();
    const res = await run(createMutation, { title: "" });
    expect(res.errors?.[0].message).toEqual("Argument Validation Error");
  });

  it("should throw validation error", async () => {
    const run = await createGqlClient();
    const res = await run(createMutation, { title: "" });

    expect(res.errors?.[0].message).toEqual("Argument Validation Error");
  });
});
