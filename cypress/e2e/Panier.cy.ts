describe('Panier', () => {
  let positiveStockId: number;
  let positiveStockName: string;
  let positiveStockAvailableStock: number;
  let negativeStockId: number;
  let negativeStockName: string;
  let authToken: string;

  // Initialisation des données avant tous les tests
  before(() => {
    // Récupération des produits
    cy.request<Cypress.Product[]>('GET', 'http://localhost:8081/products').then(
      (response) => {
        expect(response.status).to.eq(200);

        const positiveStock = response.body.find(
          (product) => product.availableStock > 0
        );
        if (positiveStock) {
          positiveStockId = positiveStock.id;
          positiveStockName = positiveStock.name;
          positiveStockAvailableStock = positiveStock.availableStock;
        }

        const negativeStock = response.body.find(
          (product) => product.availableStock < 0
        );
        if (negativeStock) {
          negativeStockId = negativeStock.id;
          negativeStockName = negativeStock.name;
        }
      }
    );

    // Authentification pour l'API
    cy.request({
      method: 'POST',
      url: 'http://localhost:8081/login',
      body: {
        username: 'test2@test.fr',
        password: 'testtest',
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      authToken = response.body.token;
    });
  });

  // Tests nécessitant la connexion automatique
  describe('Tests panier dans le navigateur', () => {
    beforeEach(() => {
      cy.login('test2@test.fr', 'testtest');
    });

    it('Accès à la page produit après connexion', () => {
      cy.visit('http://localhost:8080');
      cy.contains('Produits').click();
      cy.url().should('include', '/products');
    });

    it("Ajout d'un produit en stock au panier", () => {
      cy.visit('http://localhost:8080');
      cy.contains('Produits').click();

      const positiveProductSelector = `[ng-reflect-router-link="/products,${positiveStockId}"]`;
      cy.get(positiveProductSelector).click();

      cy.url().should('include', `/products/${positiveStockId}`);
      cy.get('body').contains(positiveStockName).should('be.visible');
      cy.get('p.stock').should(
        'contain.text',
        `${positiveStockAvailableStock} en stock`
      );

      cy.get('[data-cy="detail-product-add"]').click();
      cy.wait(1000);
      cy.url().should('include', `/cart`);
      cy.get('body').contains(positiveStockName).should('be.visible');
    });

    // Vérification de la mise à jour du stock
    it('Vérification de la mise à jour du stock', () => {
      cy.visit(`http://localhost:8080/#/products/${positiveStockId}`);
      const expectedStock = positiveStockAvailableStock - 1;
      cy.get('p.stock').should('contain.text', `${expectedStock} en stock`);
    });

    // Vérification de l'impossibilité d'ajouter un produit hors stock
    it("Ajout d'un produit hors stock au panier", () => {
      cy.visit('http://localhost:8080');
      cy.contains('Produits').click();

      const negativeProductSelector = `[ng-reflect-router-link="/products,${negativeStockId}"]`;
      cy.get(negativeProductSelector).click();

      cy.url().should('include', `/products/${negativeStockId}`);
      cy.get('body').contains(negativeStockName).should('be.visible');

      cy.get('[data-cy="detail-product-add"]').click();
      cy.wait(1000);
      cy.url().should(
        'eq',
        `http://localhost:8080/#/products/${negativeStockId}`
      );
    });

    // Vérification des limites négatives
    it('Vérification des limites négatives du produit', () => {
      cy.visit(`http://localhost:8080/#/products/${positiveStockId}`);
      // supprimer la valeur existante du champ
      cy.get('input[data-cy="detail-product-quantity"]').clear();
      // Saisie d'une donnée négative
      cy.get('input[data-cy="detail-product-quantity"]').type('-4');
      // Vérification que la valeur est mise à 0
      cy.get('input[data-cy="detail-product-quantity"]').should(
        'have.value',
        '0'
      );
    });
    // Vérification des limites supérieures à 20
    it('Vérification des limites supérieures du produit', () => {
      cy.visit(`http://localhost:8080/#/products/${positiveStockId}`);
      // supprimer la valeur existante du champ
      cy.get('input[data-cy="detail-product-quantity"]').clear();
      // Saisie d'une donnée négative
      cy.get('input[data-cy="detail-product-quantity"]').type('25');
      // Vérification que la valeur est mise à 0
      cy.get('input[data-cy="detail-product-quantity"]').should(
        'have.value',
        '20'
      );
    });
  });

  // Tests API du panier
  describe('Tests API', () => {
    it("GET /orders - Vérification de l'appel API pour contrôle du panier", () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const orderLines = response.body.orderLines;
        // Définition d'une constante à true si l'id est bien trouvé
        const containsPositiveStockId = orderLines.some(
          (line: { product: { id: number } }) =>
            line.product.id === positiveStockId
        );
        expect(containsPositiveStockId).to.be.true;
      });
    });
  });
  describe('Remise à zéro du panier', () => {
    it('DELETE /orders/{id}/Delete - Vérification et suppression de tous les éléments du panier', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        // Récupérer tous les `id` dans `orderLines`
        const orderLines: { id: number }[] = response.body.orderLines;

        // Vérification qu'il y a des éléments à supprimer
        if (orderLines && orderLines.length > 0) {
          orderLines.forEach((orderLine) => {
            const id = orderLine.id;

            // Supprimer chaque élément
            cy.request({
              method: 'DELETE',
              url: `http://localhost:8081/orders/${id}/delete`,
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }).then((deleteResponse) => {
              expect(deleteResponse.status).to.eq(200);
            });
          });
        } else {
          cy.log('Aucun élément dans le panier à supprimer');
        }
      });
    });
  });
});
