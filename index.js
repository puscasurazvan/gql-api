const { ApolloServer, gql } = require("apollo-server")
const { GraphQLScalarType } = require("graphql")
const { Kind } = require("graphql/language")

const typeDefs = gql`
  scalar Date

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

  input ActorInput {
    id: ID
  }

  type Movie {
    id: ID!
    title: String!
    releaseDate: Date
    rating: Int
    status: Status
    actor: [Actor]
  }

  input MovieInput {
    id: ID
    title: String
    releaseDate: Date
    rating: Int
    status: Status
    actor: [ActorInput]
  }

  type Query {
    movies: [Movie]
    movie(id: ID): Movie
  }

  type Mutation {
    addMovie(movie: MovieInput): [Movie]
  }
`

const actors = [
  {
    id: "corona",
    name: "Corona Virus",
  },
  {
    id: "Gigel",
    name: "Gigel Virus",
  },
]

const movies = [
  {
    id: "asdfasddfd",
    title: "Pandemic VI",
    releaseDate: new Date("10-10-2060"),
    actor: [
      {
        id: "Gigel",
      },
    ],
  },
  {
    id: "asdfasddfddddd",
    title: "Pandemic VII",
    releaseDate: new Date("10-10-2020"),
    rating: 5,
    actor: [
      {
        id: "corona",
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
  Movie: {
    actor: (obj, arg, context) => {
      const actorIds = obj.actor.map(actor => actor.id)
      const filteredActors = actors.filter(actor => {
        return actorIds.includes(actor.id)
      })
      return actors
    },
  },
  Mutation: {
    addMovie: (obj, { movie }, context) => {
      const newMoviesList = [
        ...movies,
        // new movie data
        movie,
      ]
      // Return data as expected in schema
      return newMoviesList
    },
  },
  Date: new GraphQLScalarType({
    name: "Date",
    description: "It's a date",
    parseValue(value) {
      // value from the client
      return new Date(value)
    },
    serialize(value) {
      // value sent to the client
      return value.getTime()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null
    },
  }),
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
