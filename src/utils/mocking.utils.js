import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

/**
 * Función para hashear la contraseña por defecto
 * La misma contraseña para todos los usuarios mock: "coder123"
 */
const hashDefaultPassword = async () => {
  try {
    return await bcrypt.hash('coder123', 10);
  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    throw error;
  }
};


export const generateMockUsers = async (num) => {
  try {
    const hashedPassword = await hashDefaultPassword();
    
    return Array.from({ length: num }, () => ({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(), // Asegurar minúsculas 
      age: faker.number.int({ min: 18, max: 80 }), 
      password: hashedPassword,
      role: Math.random() > 0.5 ? 'admin' : 'user', // 50/50 probabilidad
      // cart se asignará automáticamente en el UserService al crear
    }));
  } catch (error) {
    console.error('Error al generar usuarios mock:', error);
    throw new Error(`Error al generar usuarios mock: ${error.message}`);
  }
};


export const generateMockProducts = (num) => {
  const categories = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'beauty',
    'toys',
    'automotive',
    'music',
    'health'
  ];

  return Array.from({ length: num }, () => ({
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 1000, dec: 2 })),
    status: Math.random() > 0.1, // 90% de productos activos
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.helpers.arrayElement(categories),
    thumbnails: [
      faker.image.url({ width: 400, height: 400, category: 'products' }),
      faker.image.url({ width: 400, height: 400, category: 'products' })
    ]
  }));
};


export const generateTestData = async () => {
  try {
    const users = await generateMockUsers(10);
    const products = generateMockProducts(20);
    
    return { users, products };
  } catch (error) {
    throw new Error(`Error al generar datos de prueba: ${error.message}`);
  }
};