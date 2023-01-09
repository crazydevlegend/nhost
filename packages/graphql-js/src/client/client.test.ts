import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, beforeAll, beforeEach, expect, test } from 'vitest'
import { authors as mockAuthors } from '../testUtils/msw/__mocks__/authors'
import { generatedSchema, type Query } from '../testUtils/nhost.generated'
import { NhostGraphqlClient } from './client'

const mockLink = graphql.link('http://localhost:1337/v1/graphql')
const server = setupServer(
  mockLink.query('Authors', (_req, res, ctx) =>
    res(
      ctx.data({
        authors: mockAuthors,
      }),
    ),
  ),
)

const client = new NhostGraphqlClient<Query>({
  url: 'http://localhost:1337/v1/graphql',
  adminSecret: 'nhost-admin-secret',
  generatedSchema,
})

beforeAll(() => server.listen())
beforeEach(() => server.resetHandlers())
afterAll(() => server.close())

test('should return all authors', async () => {
  const authors = await client.query.authors()

  expect(authors).toStrictEqual([
    {
      __typename: 'authors',
      age: 24,
      id: 'd3e0441a-0f04-4bdd-96d3-d25a52343618',
      name: 'John Doe',
    },
    {
      __typename: 'authors',
      age: 27,
      id: '6ac21ac1-5eaa-4326-9382-7451b06906e2',
      name: 'Jane Doe',
    },
    {
      __typename: 'authors',
      age: 29,
      id: '871636ac-7e5d-4ff0-80cc-17ae6e956836',
      name: 'Don Doe',
    },
  ])
})

test('should return authors that are older than 25', async () => {
  server.use(
    mockLink.query('Authors', (req, res, ctx) =>
      res(
        ctx.data({
          authors: mockAuthors.filter(
            (author) => author.age > req.variables?.where?.age._gt,
          ),
        }),
      ),
    ),
  )

  const authors = await client.query.authors({
    variables: {
      where: {
        age: {
          _gt: 25,
        },
      },
    },
  })

  expect(authors).toStrictEqual([
    {
      __typename: 'authors',
      age: 27,
      id: '6ac21ac1-5eaa-4326-9382-7451b06906e2',
      name: 'Jane Doe',
    },
    {
      __typename: 'authors',
      age: 29,
      id: '871636ac-7e5d-4ff0-80cc-17ae6e956836',
      name: 'Don Doe',
    },
  ])
})

test('should return a single author by its primary key', async () => {
  server.use(
    mockLink.query('AuthorsByPk', (req, res, ctx) => {
      return res(
        ctx.data({
          authors_by_pk: mockAuthors.find(
            (author) => author.id === req.variables?.id,
          ),
        }),
      )
    }),
  )

  const author = await client.query.authorsByPk({
    variables: { id: '6ac21ac1-5eaa-4326-9382-7451b06906e2' },
  })

  expect(author).toMatchObject({
    __typename: 'authors',
    age: 27,
    id: '6ac21ac1-5eaa-4326-9382-7451b06906e2',
    name: 'Jane Doe',
  })
})
