describe('Tests connexion utilisateur', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/#/login');
  });
  it('Présence du champ utilisateur', () => {
    // Vérifier la présence du formulaire de connexion
    cy.get('[data-cy="login-form"]').should('exist');
    // Vérifier la présence du champ utilisateur
    cy.get('#username').should('exist').should('have.prop', 'tagName', 'INPUT');
  });

  it('Présence du champ mot de passe', () => {
    cy.get('#password').should('exist').should('have.prop', 'tagName', 'INPUT');
  });

  it('Présence du bouton de connexion', () => {
    cy.get('[data-cy="login-submit"]')
      .should('exist')
      .should('have.prop', 'tagName', 'BUTTON');
  });
});

describe('Tests champs produits', () => {
  beforeEach(() => {
    cy.login('test2@test.fr', 'testtest');
    cy.visit('http://localhost:8080/#/products');
    // Sélectionner tous les boutons "Consulter" avec [data-cy="product-link"]
    cy.get('[data-cy="product-link"]').then(($links) => {
      // Sélectionner un élément au hasard
      const randomIndex = Math.floor(Math.random() * $links.length);

      // Cliquer sur le lien sélectionné
      cy.wrap($links[randomIndex]).click();
      cy.wait(500);
    });
  });
  it("Présence du bouton d'ajout au panier ", () => {
    cy.get('[data-cy="detail-product-add"]')
      .should('exist')
      .should('have.prop', 'tagName', 'BUTTON');
  });

  it('Présence du champ de disponibilité du produit', () => {
    cy.get('[Data-cy="detail-product-quantity"]')
      .should('exist')
      .should('have.prop', 'tagName', 'INPUT');
  });
});
