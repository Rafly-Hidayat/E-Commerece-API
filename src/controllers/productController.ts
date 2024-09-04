import { Request, ResponseToolkit } from '@hapi/hapi';
import * as ProductModel from '../models/product';
import axios from 'axios';
import db from '../config/database';

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
            return h.response({ error: 'Product not found' }).code(404);
        }
        return h.response(product).code(200);
    } catch (error) {
        console.error('Error fetching product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const createProduct = async (request: Request, h: ResponseToolkit) => {
    const { title, sku, image_url, price, description } = request.payload as any;

    try {
        const newProduct = await ProductModel.createProduct({ title, sku, image_url, price, description });
        return h.response(newProduct).code(201);
    } catch (error) {
        console.error('Error creating product:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

export const updateProduct = async (request: Request, h: ResponseToolkit) => {
    const { id } = request.params;
    const { title, sku, image_url, price, description } = request.payload as any;

    try {
        const updatedProduct = await ProductModel.updateProduct(parseInt(id), { title, sku, image_url, price, description });
        if (!updatedProduct) {
            return h.response({ error: 'Product not found' }).code(404);
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
            return h.response({ error: 'Product not found' }).code(404);
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