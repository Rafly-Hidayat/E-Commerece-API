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
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
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
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024 // 5MB Max
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string().required(),
                    sku: Joi.string().required(),
                    price: Joi.number().required(),
                    description: Joi.string().allow(null, '').optional(),
                    image: Joi.any().required(),
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/products/{id}',
        handler: ProductController.updateProduct,
        options: {
            auth: 'jwt',
            payload: {
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 5 * 1024 * 1024 // 5MB Max
            },
            validate: {
                payload: Joi.object({
                    title: Joi.string(),
                    sku: Joi.string(),
                    price: Joi.number(),
                    description: Joi.string().allow(null, ''),
                    image: Joi.any(),
                }),
                failAction: (request, h, err) => {
                    throw err;
                }
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