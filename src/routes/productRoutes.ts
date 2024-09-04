import { ServerRoute } from '@hapi/hapi';
import * as ProductController from '../controllers/productController';
import Joi from 'joi';

export const productRoutes: ServerRoute[] = [
    {
        method: 'GET',
        path: '/products',
        handler: ProductController.getAllProducts,
        options: {
            auth: 'jwt',
            validate: {
                query: Joi.object({
                    page: Joi.number().integer().min(1).default(1),
                    pageSize: Joi.number().integer().min(1).max(100).default(10)
                })
            }
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
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    title: Joi.string().max(255).required(),
                    sku: Joi.string().max(50).required(),
                    image_url: Joi.string().optional(),
                    price: Joi.number().precision(2).positive().max(99999999.99).required(),
                    description: Joi.string().optional(),
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        handler: ProductController.updateProduct,
        options: {
            auth: 'jwt',
            validate: {
                payload: Joi.object({
                    title: Joi.string().max(255).optional(),
                    sku: Joi.string().max(50).optional(),
                    image_url: Joi.string().optional(),
                    price: Joi.number().precision(2).positive().max(99999999.99).required(),
                    description: Joi.string().optional(),
                })
            }
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