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
  private static API_BASE_URL = 'http://localhost:3001/api';

  // Método para carregar produtos iniciais se não existirem
  private static async loadInitialProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products`);
      if (response.ok) {
        const products = await response.json();
        return products;
      }
      return [];
    } catch (error) {
      console.error('Error loading products from API:', error);
      return [];
    }
  }

  static async getProducts(): Promise<Product[]> {
    try {
      return await this.loadInitialProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newProduct = await response.json();
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(id: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/products/${id}`);
      
      if (response.ok) {
        const product = await response.json();
        return product;
      }
      
      if (response.status === 404) {
        return null;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      console.error('Error getting product by id:', error);
      return null;
    }
  }

  // Método para exportar dados para arquivo JSON (para download)
  static async exportToJSON(): Promise<string> {
    try {
      const products = await this.getProducts();
      return JSON.stringify(products, null, 2);
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  }

  // Método para importar dados de arquivo JSON
  static async importFromJSON(jsonData: string): Promise<Product[]> {
    try {
      const products = JSON.parse(jsonData);
      if (!Array.isArray(products)) {
        throw new Error('Invalid JSON format');
      }

      // Limpar produtos existentes e importar novos
      for (const product of products) {
        await this.createProduct({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          active: product.active,
        });
      }

      return await this.getProducts();
    } catch (error) {
      console.error('Error importing JSON:', error);
      throw error;
    }
  }
}