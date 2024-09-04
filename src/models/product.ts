import db from '../config/database';

export interface Product {
    id: number;
    title: string;
    sku: string;
    image_url: string;
    price: number;
    description: string | null;
}

export interface PaginatedProducts {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface Products extends Array<Product> { }

export const getAllProducts = async (page: number, pageSize: number): Promise<PaginatedProducts> => {
    const offset = (page - 1) * pageSize;

    // Get total count of products
    const totalResult = await db.one('SELECT COUNT(*) FROM products');
    const total = parseInt(totalResult.count);

    // Get products for the current page
    const products = await db.any('SELECT * FROM products ORDER BY id LIMIT $1 OFFSET $2', [pageSize, offset]);

    return {
        products,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
    };
};

export const getProductById = async (id: number): Promise<Product | null> => {
    return db.oneOrNone('SELECT * FROM products WHERE id = $1', id);
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    return db.one(
        'INSERT INTO products (title, sku, image_url, price, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [product.title, product.sku, product.image_url, product.price, product.description]
    );
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product | null> => {
    const { title, sku, image_url, price, description } = product;
    return db.oneOrNone(
        'UPDATE products SET title = COALESCE($1, title), sku = COALESCE($2, sku), image_url = COALESCE($3, image_url), price = COALESCE($4, price), description = COALESCE($5, description) WHERE id = $6 RETURNING *',
        [title, sku, image_url, price, description, id]
    );
};

export const deleteProduct = async (id: number): Promise<Product | null> => {
    return db.oneOrNone('DELETE FROM products WHERE id = $1 RETURNING *', id);
};

export const importProducts = async (productValues: Products): Promise<void> => {
    // Batch insert, skipping duplicates based on the SKU
    const query = `
    INSERT INTO products (title, sku, image_url, price, description)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (sku) DO NOTHING;
    `;

    // Perform batch insert with pg-promise
    await db.tx(t => {
        const queries = productValues.map((product: Product) => t.none(query, product));
        return t.batch(queries);
    });
}