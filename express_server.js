const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

/**
 * This is our database. 🙂
 */
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

let username;

/**
 * This function generates a random string of characters [A-Za-z0-9]
 * @param {*} charactersLength The length of the string to generate.
 * @returns A random string of the specified length.
 */
const generateRandomString = function(charactersLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Build the result i.e. the random string by generating a random character.
  for (let i = 0; i < charactersLength; i++) {
    // Generate a random number within the length of available characters.
    let randomNumber = Math.floor(Math.random() * characters.length);

    // Grab the character at that position and add it to our result.
    result += characters.charAt(randomNumber);
  }
  return result;
};


/**
 * Display our Main Page
 */
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


/**
 * Display the New URL Page
 */
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

/**
 * Add a new URL to our database.
 */
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const id = generateRandomString(6);  // Create the short URL by generating a random string.
  const redirectURL = `/urls/${id}`;
  urlDatabase[id] = longURL;   // Add the value to our database
 
  // Log data to the console.
  //console.log(`Redirect URL: ${redirectURL}`);
  console.log(`Added Id: ${id}, URL: ${longURL}`);
  console.log(urlDatabase);

  // After completing the POST request, redirect the user to the long URL
  res.redirect(redirectURL);
});

/**
 * Delete a URL from our database.
 */
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  
  // Delete the record from our database.
  delete urlDatabase[id];

  // Log data to the console.
  console.log(`Deleted Id: ${id}`);
  console.log(urlDatabase);

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Update a URL in our database.
 */
app.post("/urls/:id/update", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  
  // Update the record in our database.
  urlDatabase[id] = longURL;

  // Log data to the console.
  console.log(`Update Id: ${id}, URL: ${longURL}`);
  console.log(urlDatabase);

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Log the user into the system
 * Actually, we are just setting the cookie.
 */
app.post("/login", (req, res) => {
  username = req.body.username;
  
  // Log data to the console.
  console.log(`Username: ${username}`);
  
  res.cookie("username", username);
  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Display the info for a specific URL.
 */
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  const templateVars = { id: id, longURL: longURL };
  res.render("urls_show", templateVars);
});

/**
 * Using the Tiny URL, open the long URL.
 */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

/**
 * Our Listener.
 */
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});