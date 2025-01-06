
// Test connexion ko

context("POST /login", function () {
  it("login utilisateur inconnu", function () {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login", 
      body: {
        username: "dazdzadza@test.fr",
        password: "zdazd",
      },
      failOnStatusCode: false // Ne pas générer d'erreur cypress
    }).then((response) => {
      expect(response.status).to.eq(401); // Erreur pour un utilisateur inconnu
    });
  });
});

// Test connexion ok

let authToken: string; // Variable globale pour obtenir le Token

context("POST /login", function () {
  it("login utilisateur connu", function () {
    cy.request({
      method: "POST",
      url: "http://localhost:8081/login", 
      body: {
        username: "test2@test.fr",
        password: "testtest",
      },

    }).then((response) => {
      expect(response.status).to.eq(200); // Validation du statut
      authToken = response.body.token; // Stocker le token dans la variable
      expect(response.body).to.have.property("token");
    });
  });
});




// Définition de l'interface pour un produit
interface Product {
  id: number;  // Ou number, selon le type d'ID
  name: string;
  availableStock: number;
}

// Définition des produits à récupérer avec et sans stock
context("GET /products", () => {
  let positiveStockId : number,
   positiveStockName: string,
   negativeStockId : number,
  negativeStockName : string;

  it("Récupération d'un produit avec et sans stock", () => {
    cy.fetchProducts().then((products) => {
      // Extraire les données retournées par la commande
      positiveStockId = products.positiveStockId;
      positiveStockName = products.positiveStockName;
      negativeStockId = products.negativeStockId;
      negativeStockName = products.negativeStockName;
    });
  });


  
  // Test affichage produit


  it("Requête d’une fiche produit spécifique", () => {
    const productUrl = `http://localhost:8081/products/${positiveStockId}`;
    cy.request("GET", productUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(positiveStockName); // Vérifier le nom du produit
    })
  })


// Ajout au panier d'un produit en stock
  context("POST /orders/add", () => {
    it("Ajouter un produit disponible au panier", function () {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/orders/add",
        headers: {
          Authorization: `Bearer ${authToken}`, // Authentification avec le token
        },
        body: {
          product: positiveStockId, // Utilisation de l'ID du produit avec stock
          quantity: 1,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });


    // Ajout au panier d'un produit hors stock
    it("Ajouter un produit en rupture de stock", function () {
      cy.request({
        method: "POST",
        url: "http://localhost:8081/orders/add",
        headers: {
          Authorization: `Bearer ${authToken}`, // Authentification avec le token
        },
        body: {
          product: negativeStockId, // Utilisation de l'ID du produit sans stock
          quantity: 1,
        },
        failOnStatusCode: false, // Permet de tester un scénario avec échec
      }).then((response) => {
        expect(response.status).to.eq(400); // Attente d'une réponse d'échec
      });
    });
  });
});


 // Vérification de l'affichage du panier avec authentification

context("GET /orders", function () {
  it("Requête de la liste des produits du panier", function () {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      headers: {
        Authorization: `Bearer ${authToken}`, // Authentification avec le token
      },
    }).then((response) => {
      expect(response.status).to.eq(200)
    })
  })
})

 // Vérification de l'affichage du panier sans authentification

 context("GET /orders", function () {
  it("Requête sur les données confidentielles d'un utilisateur avant connexion", function () {
    cy.request({
      method: "GET",
      url: "http://localhost:8081/orders",
      failOnStatusCode: false // Ne pas générer d'erreur cypress
    })
    .then((response) => {
      expect(response.status).to.eq(401)
    })
  })
})


// Ajout d'un avis


context("POST /reviews", function () {
  it("Ajouter un avis", function () {
    const reviewData = {
      title: "titre",
      comment: "Commentaire avec des chiffres 1234",
      rating: 4,
    };
    cy.request({
      method: "POST",
      url: "http://localhost:8081/reviews", 
      headers: {
        Authorization: `Bearer ${authToken}`, // Authentification avec le token
      },
      body: reviewData,
    }).then((response) => {
      expect(response.status).to.eq(200); // Validation du statut

      // Vérifier que la réponse contient les données attendues
      expect(response.body).to.have.property("title", reviewData.title);
      expect(response.body).to.have.property("comment", reviewData.comment);
      expect(response.body).to.have.property("rating", reviewData.rating);

      // Vérifier si un ID ou un identifiant unique est généré
      expect(response.body).to.have.property("id")
    });
  });
});





