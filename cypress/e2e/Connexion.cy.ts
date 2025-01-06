describe('Connexion utilisateur', () => {
  it('Affichage de la page', () => {
    cy.visit('http://localhost:8080');
  });

  it('Cliquer sur "Connexion"', () => {
    cy.visit('http://localhost:8080');

    cy.contains('Connexion').click();

    cy.url().should('include', '/login');
  });

  it('Saisie des champs et connexion', () => {
    // Accéder à la page de connexion
    cy.visit('http://localhost:8080/#/login');

    // Saisie du champ "Email"
    cy.get('input[id="username"]').type('test2@test.fr');
    cy.get('input[id="username"]').should('have.value', 'test2@test.fr');

    // Saisie du champ "Mot de passe"
    cy.get('input[id="password"]').type('testtest');
    cy.get('input[id="password"]').should('have.value', 'testtest');

    // Clique sur le bouton "Se connecter"
    cy.get('[data-cy="login-submit"]').click();

    // Vérifie que l'URL est exactement celle attendue
    cy.url().should('eq', 'http://localhost:8080/#/');

    // Vérifie que "Déconnexion" est présent dans la barre de navigation
    cy.get('nav').contains('Déconnexion').should('be.visible');

    // Vérifie que "Mon panier" est présent dans la barre de navigation
    cy.get('nav').contains('Mon panier').should('be.visible');
  });
});
