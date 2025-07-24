const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Dog Breeds Explorer API',
    version: '1.0.0',
    description: 'API for fetching dog breeds and managing favorites.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  paths: {
    '/api/breeds': {
      get: {
        tags: ['Breeds'],
        summary: 'Get a list of all dog breeds',
        responses: {
          '200': {
            description: 'A simplified array of dog breed names.',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['affenpinscher', 'bulldog-boston'],
                },
              },
            },
          },
        },
      },
    },
    '/api/breeds/{breed}/image': {
      get: {
        tags: ['Breeds'],
        summary: 'Get a single random image for a specific breed',
        parameters: [
          {
            in: 'path',
            name: 'breed',
            required: true,
            schema: { type: 'string' },
            description: 'The name of the breed (e.g., "akita" or "bulldog-boston").',
          },
        ],
        responses: { '200': { description: 'An object containing a single image URL.' } },
      },
    },
    '/api/breeds/{breed}/images': {
      get: {
        tags: ['Breeds'],
        summary: 'Get three random images for a specific breed',
        parameters: [
          {
            in: 'path',
            name: 'breed',
            required: true,
            schema: { type: 'string' },
            description: 'The name of the breed.',
          },
        ],
        responses: { '200': { description: 'An array of three image URLs.' } },
      },
    },
    '/api/favorites': {
      get: {
        tags: ['Favorites'],
        summary: 'Get the list of favorite breeds',
        responses: { '200': { description: 'An array of favorite breed names.' } },
      },
      post: {
        tags: ['Favorites'],
        summary: 'Add a breed to favorites',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { breed: { type: 'string', example: 'husky' } },
              },
            },
          },
        },
        responses: { '201': { description: 'Breed added successfully.' } },
      },
    },
    '/api/favorites/{breed}': {
      delete: {
        tags: ['Favorites'],
        summary: 'Remove a breed from favorites',
        parameters: [
          {
            in: 'path',
            name: 'breed',
            required: true,
            schema: { type: 'string' },
            description: 'The name of the breed to remove.',
          },
        ],
        responses: { '204': { description: 'Breed removed successfully.' } },
      },
    },
  },
};

export default swaggerDefinition;