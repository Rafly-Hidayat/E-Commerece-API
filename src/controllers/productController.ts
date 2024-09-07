import { Request, ResponseToolkit } from '@hapi/hapi';
import * as ProductModel from '../models/product';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const writeFile = util.promisify(fs.writeFile);

const saveImage = async (image: any): Promise<string> => {
    const name = `${Date.now()}-${image.hapi.filename}`;
    const filePath = path.join(__dirname, '../../uploads', name);
    await writeFile(filePath, image._data);
    return `uploads/${name}`;
};

export interface Product {
    id: number;
    title: string;
    sku: string;
    image_url: string;
    price: number;
    description: string | null;
}

export const getAllProducts = async (request: Request, h: ResponseToolkit) => {
    const page = parseInt(request.query.page as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    try {
        const paginatedProducts = await ProductModel.getAllProducts(page, pageSize);
        return h.response(paginatedProducts).code(200);
    } catch (error) {
        console.error('Error fetching products:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const getProductById = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    try {
        const product = await ProductModel.getProductById(parseInt(id));
        if (!product) {
            return h.response({ error: 'Not Found', message: 'Product not found' }).code(404);
        }
        return h.response(product).code(200);
    } catch (error) {
        console.error('Error fetching product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const createProduct = async (request: Request, h: ResponseToolkit) => {
    try {
        const payload: any = request.payload;
        const image: any = payload.image;

        // Validate image
        if (!image || !image.hapi.headers['content-type'].startsWith('image/')) {
            return h.response({ error: 'Bad Request', message: 'Invalid image file' }).code(400);
        }

        // Validate SKU
        const existingProduct = await ProductModel.getProductBySku(payload.sku);
        if (existingProduct) {
            return h.response({ error: 'Conflict', message: 'A product with this SKU already exists' }).code(409);
        }

        const imageUrl = await saveImage(image);

        const newProduct = await ProductModel.createProduct({
            title: payload.title,
            sku: payload.sku,
            image_url: `${request.server.info.uri}/${imageUrl}`,
            price: parseFloat(payload.price),
            description: payload.description
        });

        return h.response(newProduct).code(201);
    } catch (error) {
        console.error('Error creating product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const updateProduct = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const payload: any = request.payload;

    try {
        let updateData: Partial<ProductModel.Product> = {
            title: payload.title,
            price: payload.price ? parseFloat(payload.price) : undefined,
            description: payload.description
        };

        if (payload.sku) {
            // Validate SKU
            const existingProduct = await ProductModel.getProductBySku(payload.sku);
            if (existingProduct && existingProduct.id !== +id) {
                return h.response({ error: 'Conflict', message: 'A product with this SKU already exists' }).code(409);
            }
            updateData.sku = payload.sku;
        }

        if (payload.image) {
            const image: any = payload.image;

            // Validate image
            if (!image || !image.hapi.headers['content-type'].startsWith('image/')) {
                return h.response({ error: 'Bad Request', message: 'Invalid image file' }).code(400);
            }

            const imageUrl = await saveImage(image);
            updateData.image_url = `${request.server.info.uri}/${imageUrl}`;
        }

        const updatedProduct = await ProductModel.updateProduct(parseInt(id), updateData);
        if (!updatedProduct) {
            return h.response({ error: 'Not Found', message: 'Product not found' }).code(404);
        }
        return h.response(updatedProduct).code(200);
    } catch (error) {
        console.error('Error updating product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const deleteProduct = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;

    try {
        const deletedProduct = await ProductModel.deleteProduct(parseInt(id));
        if (!deletedProduct) {
            return h.response({ error: 'Not Found', message: 'Product not found' }).code(404);
        }
        return h.response({ message: 'Product deleted successfully' }).code(200);
    } catch (error) {
        console.error('Error deleting product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const importProducts = async (request: Request, h: ResponseToolkit) => {
    try {
        const response = await axios.get('https://dummyjson.com/products?limit=194');
        const products = response.data.products;

        const productValues = products.map((product: any) => [
            product.title,
            product.id.toString(),
            product.thumbnail,
            product.price,
            product.description
        ]);

        await ProductModel.importProducts(productValues)
        return h.response({ message: 'Products imported successfully' }).code(200);
    } catch (error) {
        console.error('Error importing products:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};