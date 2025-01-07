// Require selenium webdriver 
let webdriver = require("selenium-webdriver"); 
const { By, until } = webdriver;
  
// Require webdriver for chrome 
// browser called chromedriver 
require("chromedriver"); 
  
// Build new window of chrome 

async function testInscription(){

let driver =  await new webdriver.Builder() .forBrowser("chrome").build(); 
  
// Open localhost using get method 
await driver.get("http://localhost:8080/");

// Ouverture de la fiche d'inscription

await driver.findElement(By.xpath("//*[@data-cy='nav-link-register']")).click();

await driver.wait(until.urlContains("/register"), 5000);



// Saisie du champ nom
await driver.findElement(By.id("lastname")).click();
await driver.findElement(By.id("lastname")).sendKeys("TestNom");


// Saisie du champ prénom
await driver.findElement(By.id("firstname")).click();
await driver.findElement(By.id("firstname")).sendKeys("TestPrénom");

// Générer une adresse email unique
function generateRandomEmail(domain = "test.fr") {
    const randomString = Math.random().toString(36).substring(2, 10); // Génère une chaîne aléatoire
    return `${randomString}@${domain}`;
}

// Stocker l'email généré dans une constante
const randomEmail = generateRandomEmail();

// saisie du champ email

await driver.findElement(By.id("email")).click();
await driver.findElement(By.id("email")).sendKeys(randomEmail);


// Stocker le mot de passe dans une constante
const password = "testtest"

// saisie du champ mot de passe
await driver.findElement(By.id("password")).click();
await driver.findElement(By.id("password")).sendKeys(password);

// saisie du champ confirmation de mot de passe
await driver.findElement(By.id("confirm")).click();
await driver.findElement(By.id("confirm")).sendKeys(password);

// clic sur le bouton s'inscrire

await driver.findElement(By.xpath("//*[@data-cy='register-submit']")).click();



const isInscriptionOk = await driver.wait(
    until.elementLocated(By.xpath("//*[@data-cy='nav-link-logout']")),
    5000 
).catch(() => null); 

// Vérifier si l'élément a été trouvé
if (isInscriptionOk) {
    console.log("Succès de l'inscription");
} else {
    console.log("Échec de l'inscription'");
}

// clic sur le bouton déconnexion 

await driver.findElement(By.xpath("//*[@data-cy='nav-link-logout']")).click();

await driver.wait(
    until.elementLocated(By.xpath("//*[@data-cy='nav-link-login']")),
    5000 // Attente maximale de 5 secondes 
    );

// clic sur le bouton connexion 

await driver.findElement(By.xpath("//*[@data-cy='nav-link-login']")).click();

await driver.wait(until.urlContains("/login"), 5000);


 // saisie du champ email

await driver.findElement(By.id("username")).click();
await driver.findElement(By.id("username")).sendKeys(randomEmail);  

// saisie du champ mot de passe
await driver.findElement(By.id("password")).click();
await driver.findElement(By.id("password")).sendKeys(password);


// Cliquez sur le bouton de connexion
await driver.findElement(By.xpath("//*[@data-cy='login-submit']")).click();


const isLoggedIn = await driver.wait(
    until.elementLocated(By.xpath("//*[@data-cy='nav-link-cart']")),
    3000 // Attente maximale de 8 secondes
).catch(() => null); 

// Vérifier si l'élément a été trouvé
if (isLoggedIn) {
    console.log("Succès de la connexion");
} else {
    console.log("Échec de la connexion");
}


// Fermeture du navigateur
await driver.quit();

}

testInscription()
