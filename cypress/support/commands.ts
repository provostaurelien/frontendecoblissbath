Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('http://localhost:8080/#/login');

  // Saisie des identifiants
  cy.get('input[id="username"]').type(username);
  cy.get('input[id="password"]').type(password);

  // Clique sur "Se connecter"
  cy.get('[data-cy="login-submit"]').click();

  // Vérifie que la connexion est réussie
  cy.url().should('eq', 'http://localhost:8080/#/');
  cy.get('nav').contains('Déconnexion').should('be.visible');
});

Cypress.Commands.add('fetchProducts', () => {
  return cy
    .request('GET', 'http://localhost:8081/products')
    .then((response) => {
      expect(response.status).to.eq(200);
      const products = response.body;

      // Trouver un produit avec stock positif
      const positiveStockProduct = products.find(
        (product: Product) => product.availableStock > 0
      );
      expect(positiveStockProduct).to.exist;

      // Trouver un produit avec stock nul ou négatif
      const negativeStockProduct = products.find(
        (product: Product) => product.availableStock <= 0
      );
      expect(negativeStockProduct).to.exist;

      // Retourner les données extraites
      return {
        positiveStockId: positiveStockProduct.id,
        positiveStockName: positiveStockProduct.name,
        positiveStockAvailableStock: positiveStockProduct.availableStock,
        negativeStockId: negativeStockProduct.id,
        negativeStockName: negativeStockProduct.name,
      };
    });
});
