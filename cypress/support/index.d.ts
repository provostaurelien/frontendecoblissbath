// Fichier créé pour éviter  les erreurs de réutilisation de la fonction login et panier
declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in a user.
     * @example cy.login('test2@test.fr', 'password123')
     */
    login(username: string, password: string): Chainable<void>;
  }
  interface Chainable {
    /**
     * Custom command to fetch products with positive and negative stock.
     * @returns An object containing positive and negative stock product details.
     */
    fetchProducts(): Chainable<{
      positiveStockId: number;
      positiveStockName: string;
      positiveStockAvailableStock: number;
      negativeStockId: number;
      negativeStockName: string;
    }>;
  }
  interface Product {
    id: number;
    name: string;
    availableStock: number;
  }
}
