import "reflect-metadata";
import {
  createGqlClient,
  defaultData,
  findByIdQuery,
  findQuery,
} from "./utils";
import { Task } from "../src/schema/tasks.model";
import { start } from "repl";

describe("Find tasks", () => {
  it("should find a task by id", async () => {
    const run = await createGqlClient(defaultData);

    const res = (await run(findByIdQuery, { id: defaultData[0].id })).data
      ?.task as Task;

    expect(res.id).toEqual(defaultData[0].id);
  });

  it("should find all tasks", async () => {
    const run = await createGqlClient(defaultData);
    const res = (await run(findQuery)).data?.tasks as { list: Task[] };
    expect(res.list.length).toEqual(defaultData.length);
  });

  it("should find 1 task completed and 4 not completed", async () => {
    const run = await createGqlClient(defaultData);
    const completed = (await run(findQuery, { filter: { completed: true } }))
      .data?.tasks as { list: Task[] };
    expect(completed.list.length).toEqual(
      defaultData.filter((task) => task.completed).length
    );
    const incomplete = (await run(findQuery, { filter: { completed: false } }))
      .data?.tasks as { list: Task[] };
    expect(incomplete.list.length).toEqual(
      defaultData.filter((task) => !task.completed).length
    );
  });
  it("should find tasks by due date range", async () => {
    const startDate = new Date("2025-02-04");
    const endDate = new Date("2025-02-6");

    const run = await createGqlClient(defaultData);
    const res = (
      await run(findQuery, {
        filter: {
          startDueDate: startDate.toISOString(),
          endDueDate: endDate.toISOString(),
        },
      })
    )?.data?.tasks as { list: Task[] };
    expect(res.list.length).toEqual(
      defaultData.filter(
        (task) =>
          new Date(task.dueDate) >= startDate &&
          new Date(task.dueDate) <= endDate
      ).length
    );
  });
});
