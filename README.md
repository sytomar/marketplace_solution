# Marketplace solution

### Technology Stack
   * Node.js([Express](https://expressjs.com/en/starter/installing.html) Framework)
   * Embedded JavaScript templating([EJS](https://ejs.co/))

### Installation Step
  * Clone repository.
  * Install `Node LTS, nodemon`.
  * Run `npm start`

### NOTE:
  * Dont forget to add the db files in "./db" directory.
  * I made few modification in "product.json" file, added new key to every object as because of missing parameters the purpose of the system is not fulfilled.
    * "productOwnerId": integer(user id as owner id),
    * "productLastModified": datetime(when product last modified),
    * "productLastModifiedTimestamp": integer(timestamp of when product last modified)

  Either generate this fields in "product.json" file and add to "./db" directory.

Enjoy Coding 🍻 🍻 🍻 ...!!!