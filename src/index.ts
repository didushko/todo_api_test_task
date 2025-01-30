import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { TasksResolver } from "./schema/tasks.resolver";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [TasksResolver],
    validate: true, //validation provided in model, don't need check any at resolver
  });

  const server = new ApolloServer({ schema });

  const { url } = await server.listen(4000);
  console.log(`Server is running at ${url}`);
}

bootstrap();
