import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuración básica de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce Backend API',
      version: '1.0.0',
      description: 'API completa para sistema de e-commerce con autenticación, productos, carritos y mocking',
      contact: {
        name: 'Eugenia M. Arias',
        email: 'contacto@ejemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'authToken',
          description: 'JWT token en cookie para autenticación'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['first_name', 'last_name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            first_name: {
              type: 'string',
              maxLength: 100,
              description: 'Nombre del usuario'
            },
            last_name: {
              type: 'string',
              maxLength: 100,
              description: 'Apellido del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario'
            },
            age: {
              type: 'number',
              minimum: 0,
              maximum: 120,
              description: 'Edad del usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña hasheada'
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              default: 'user',
              description: 'Rol del usuario'
            },
            cart: {
              type: 'string',
              description: 'ID del carrito asignado al usuario'
            }
          }
        },
        UserDTO: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID del usuario'
            },
            firstName: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            lastName: {
              type: 'string',
              description: 'Apellido del usuario'
            },
            email: {
              type: 'string',
              description: 'Email del usuario'
            },
            age: {
              type: 'number',
              description: 'Edad del usuario'
            },
            role: {
              type: 'string',
              description: 'Rol del usuario'
            },
            cart: {
              type: 'string',
              description: 'ID del carrito'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'success'
            },
            message: {
              type: 'string',
              description: 'Mensaje de éxito'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './docs/swagger/*.js'], // Rutas donde buscar documentación
};

// Generar especificación Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerSpec };