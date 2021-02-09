const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");
const query = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [todo]
  }
  type Mutation {
    addtodo(name: String): todo
    deletetodo(id: String): todo
    updatetodo(id: String, name: String): todo
  }
  type todo {
    id: String
    name: String
   
  }
`;

const client = new faunadb.Client({
  secret: 'fnAD-9S3PmACAa8u1WwUBLdRIX1_MiWgicvDXIy7',
});

const resolvers = {
  Query: {
    todos: async () => {
      var result = await client.query(
        query.Map(
          query.Paginate(query.Documents(query.Collection("TodoList"))),
          query.Lambda((x) => query.Get(x))
        )
      );
      const todos = result.data.map((todo) => ({
        id: todo.ref.id,
        name: todo.data.name,
      }));

      return todos;
    },
  },
  Mutation: {
    addtodo: async (_, { name}) => {
      const item = {
        data: { name: name },
      };

      try {
        const result = await client.query(
          query.Create(query.Collection("TodoList"), item)
        );
        console.log("result", result);

        return {
          name: result.data.name,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          id: "-1",
        };
      }
    },

    deletetodo: async (_, { id }) => {
      try {
        const result = await client.query(
          query.Delete(query.Ref(query.Collection("TodoList"), id))
        );
        console.log("result", result);

        return {
          name: result.data.name,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          id: "-1",
        };
      }
    },

    updatetodo: async (_, { id, name }) => {
      const item = {
        data: { name: name},
      };

      try {
        const result = await client.query(
          query.Update(query.Ref(query.Collection("TodoList"), id), item)
        );
        console.log("result", result);

        return {
          name: result.data.name,
          id: result.ref.id,
        };
      } catch (error) {
        console.log("Error", error);
        return {
          name: "error",
          id: "-1",
        };
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler();