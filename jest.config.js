export default {
  // Configurar para ES modules
  testEnvironment: 'node',
  
  // Transformaciones
  transform: {},
  
  // Pattern para encontrar tests
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ],
  
  // Timeout para tests de API
  testTimeout: 30000
};