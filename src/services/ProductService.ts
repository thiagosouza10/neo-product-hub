export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ProductService {
  private static STORAGE_KEY = 'products';

  static async getProducts(): Promise<Product[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const products = await this.getProducts();
      const newProduct: Product = {
        ...productData,
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.push(newProduct);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Product not found');
      }

      const updatedProduct: Product = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      };

      products[index] = updatedProduct;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const products = await this.getProducts();
      const filteredProducts = products.filter(p => p.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProducts));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const products = await this.getProducts();
      return products.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting product by id:', error);
      return null;
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}