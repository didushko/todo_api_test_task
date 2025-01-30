import "reflect-metadata";
import {
  createGqlClient,
  defaultData,
  findByIdQuery,
  findQuery,
  updateMutation,
} from "./utils";
import { Task } from "../src/schema/tasks.model";
import { start } from "repl";

describe("Update tasks", () => {
  it("should update complete field", async () => {
    const run = await createGqlClient(defaultData);
    const res = (
      await run(updateMutation, {
        id: "481af2b9-92ad-4bc6-85ac-33ddac527bc5",
        updateFields: { completed: true },
      })
    )?.data?.updateTask as Task;
    expect(res.completed).toEqual(true);
  });
  it("should throw validation error", async () => {
    const run = await createGqlClient();
    const res = await run(updateMutation, {
      id: "481af2b9-92ad-4bc6-85ac-33ddac527bc5",
      updateFields: { title: "" },
    });
    expect(res.errors?.[0].message).toEqual("Argument Validation Error");
  });
});
