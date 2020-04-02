const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Movie {
    title: String
    releaseDate: String
    rating: Int
  }
  type Query {
    movies: [Movie]
  }
`

const movies = [
  {
    title: 'Grand theft auto 6',
    releaseDate: '10-10-2022',
    rating: 5,
  },
  {
    title: 'Grand theft auto 7',
    releaseDate: '10-10-2028',
    rating: 5,
  },
]

const resolvers = {
  Query: {
    movies: () => {
      return movies
    },
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`Server started at ${url}`)
})
