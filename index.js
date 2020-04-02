const { ApolloServer, gql } = require("apollo-server")

const typeDefs = gql`
  enum Status {
    WATCHED
    INTERESTED
    NOT_INTERESTED
    UNKNOWN
  }

  type Actor {
    id: ID!
    name: String!
  }

  type Movie {
    id: ID!
    title: String!
    releaseDate: String
    rating: Int
    status: Status
    actor: [Actor]
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }
`

const movies = [
  {
    id: "asdfasddfd",
    title: "GTA VI",
    releaseDate: "10-10-2060",
  },
  {
    id: "asdfasddfddddd",
    title: "GTA VII",
    releaseDate: "10-10-2020",
    rating: 5,
    actor: [
      {
        id: "asdfasdf",
        name: "Gordon Liu",
      },
    ],
  },
]

const resolvers = {
  Query: {
    movies: () => {
      return movies
    },

    movie: (obj, { id }, context, info) => {
      const foundMovie = movies.find(movie => {
        return movie.id === id
      })
      return foundMovie
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
})

server
  .listen({
    port: process.env.PORT || 4000,
  })
  .then(({ url }) => {
    console.log(`Server started at ${url}`)
  })
