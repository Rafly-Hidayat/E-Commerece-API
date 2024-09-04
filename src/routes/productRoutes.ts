import { ServerRoute } from '@hapi/hapi';
import * as ProductController from '../controllers/productController';

export const productRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/products',
        handler: ProductController.getAllProducts,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'GET',
        path: '/products/{id}',
        handler: ProductController.getProductById,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'POST',
        path: '/products',
        handler: ProductController.createProduct,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        handler: ProductController.updateProduct,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/products/{id}',
        handler: ProductController.deleteProduct,
        options: {
            auth: 'jwt'
        }
    },
    {
        method: 'POST',
        path: '/products/import',
        handler: ProductController.importProducts,
        options: {
            auth: 'jwt'
        }
    }
];