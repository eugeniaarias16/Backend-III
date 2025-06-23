// Tests unitarios para el controlador de carritos (SIN base de datos)
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock del servicio de carritos ANTES de importar el controlador
const mockCartService = {
    getAllCarts: jest.fn(),
    createCart: jest.fn(),
    addProductToCart: jest.fn()
};

// Mock del módulo completo
jest.unstable_mockModule('../src/services/cart.service.js', () => ({
    default: mockCartService
}));

// Importar el controlador DESPUÉS de crear el mock
const { getAllCarts, createCart, addProductToCart } = await import('../src/controllers/cart.controller.js');

describe('Cart Controller', () => {
    let req, res;

    beforeEach(() => {
        // Resetear todos los mocks antes de cada test
        jest.clearAllMocks();
        
        // Mock de req y res
        req = {};
        res = {
            success: jest.fn(),
            created: jest.fn(),
            error: jest.fn()
        };
    });

    it('getAllCarts debe devolver todos los carritos', async () => {
        // Datos falsos para el test
        const fakeCarts = [
            { _id: '1', products: [] },
            { _id: '2', products: [] }
        ];

        // Mock del servicio
        mockCartService.getAllCarts.mockResolvedValue(fakeCarts);

        // Ejecutar el controlador
        await getAllCarts(req, res);

        // Verificar que se llamó al servicio
        expect(mockCartService.getAllCarts).toHaveBeenCalledTimes(1);
        
        // Verificar la respuesta
        expect(res.success).toHaveBeenCalledWith('Carritos obtenidos correctamente', fakeCarts);
    });

    it('createCart debe crear un carrito nuevo', async () => {
        // Datos falsos para el test
        const fakeNewCart = {
            _id: 'new-cart-id',
            products: []
        };

        // Mock del servicio
        mockCartService.createCart.mockResolvedValue(fakeNewCart);

        // Ejecutar el controlador
        await createCart(req, res);

        // Verificar que se llamó al servicio
        expect(mockCartService.createCart).toHaveBeenCalledTimes(1);
        
        // Verificar la respuesta
        expect(res.created).toHaveBeenCalledWith('Carrito creado correctamente', fakeNewCart);
    });

    it('addProductToCart debe agregar producto al carrito', async () => {
        // Setup del request
        req.params = { cid: 'cart-id', pid: 'product-id' };
        req.body = { quantity: 2 };

        const fakeUpdatedCart = {
            _id: 'cart-id',
            products: [{ product: 'product-id', quantity: 2 }]
        };

        // Mock del servicio
        mockCartService.addProductToCart.mockResolvedValue(fakeUpdatedCart);

        // Ejecutar el controlador
        await addProductToCart(req, res);

        // Verificar que se llamó al servicio con los parámetros correctos
        expect(mockCartService.addProductToCart).toHaveBeenCalledWith('cart-id', 'product-id', 2);
        
        // Verificar la respuesta
        expect(res.success).toHaveBeenCalledWith('Producto agregado al carrito correctamente', fakeUpdatedCart);
    });
});