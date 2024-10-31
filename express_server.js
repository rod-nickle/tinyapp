const express = require("express");
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const PORT = 8080; // default port 8080
const app = express();

// Configurations
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());


/**
 * This is our database. 🙂
 */
const urlDatabase = {
  "1DbaZv": {
    longURL: "https://www.tsn.ca",
    userId: "lSHoYY",
  },
  VkXQck: {
    longURL: "https://www.google.ca",
    userId: "lSHoYY",
  },
  eMe7jn: {
    longURL: "https://www.lighthouselabs.ca",
    userId: "Hh65Sm",
  },
};

const users = {
  lSHoYY: {
    id: "lSHoYY",
    email: "a@a.com",
    password: "1234",
  },
  Hh65Sm: {
    id: "Hh65Sm",
    email: "b@b.com",
    password: "1234",
  },
};


/**
 * This function generates a random string of characters [A-Za-z0-9]
 * @param {*} charactersLength The length of the string to generate.
 * @returns A random string of the specified length.
 */
const generateRandomString = (charactersLength) => {
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
 * This function returns a user object from the Users database.
 * @param {*} email The email to find in the Users database.
 * @returns The User object if found; otherwise, NULL.
 */
const getUserByEmail = (email) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      // We found our user!
      return user;
    }
  }
  return null;
};


/**
 * This function returns a new object of URLs filtered by the userId
 * of the owner
 * @param {*} userId The Id of the currently logged in User
 * @returns A object of URLs for which he owns.
 */
const urlsForUser = (userId) => {
  const urlObjectsForUser = {};

  // Loop throug all URLs in our database.
  // If the userId matches, add the object to our new object of URLS.
  for (const databaseId in urlDatabase) {
    if (urlDatabase[databaseId].userId === userId) {
      urlObjectsForUser[databaseId] = urlDatabase[databaseId];
    }
  }

  return urlObjectsForUser;
};

/**
 * Display our Main Page
 */
app.get("/urls", (req, res) => {
  const userId = req.cookies.userId;

  // If the user is logged in, redirect them the Login Page
  if (!userId) {
    return res.redirect('/login');
  }

  // Get the list of URLs owned by the current user.
   const urlObjectsForUser = urlsForUser(userId);

  const templateVars = {
    urls: urlObjectsForUser,
    user: users[userId],
  };
  res.render("urls_index", templateVars);
});


/**
 * Display the New URL Page
 */
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.userId;

  // If the user is logged in, redirect them the Login Page
  if (!userId) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: users[userId],
  };
  res.render("urls_new", templateVars);
});

/**
 * Add a new URL to our database.
 */
app.post("/urls", (req, res) => {
  const userId = req.cookies.userId;
  const longURL = req.body.longURL;

  // If the user is NOT logged in, throw an error message
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // Throw an error if No URL was entered.
  if (!longURL) {
    return res.status(400).send('You must provide a URL to proceed.');
  }

  const id = generateRandomString(6);  // Create the short URL by generating a random string.
  const redirectURL = `/urls/${id}`;

  // Add the new URL to our database
  urlDatabase[id] = {longURL, userId};
 
  // Log data to the console.
  console.log(urlDatabase);

  // After completing the POST request, redirect the user to the long URL
  res.redirect(redirectURL);
});

/**
 * Delete a URL from our database.
 */
app.post("/urls/:id/delete", (req, res) => {
  const id = req.params.id;
  const userId = req.cookies.userId;
  
  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // If the user is NOT logged in, throw an error message
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // If the user does not own the specific URL, then throw an error.
  const urlObjectsForUser = urlsForUser(userId);
  if (!urlObjectsForUser[id]) {
    return res.status(403).send('You do not have authorization.');
  }

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
  const userId = req.cookies.userId;
  
  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // If the user is NOT logged in, throw an error message
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // If the user does not own the specific URL, then throw an error.
  const urlObjectsForUser = urlsForUser(userId);
  if (!urlObjectsForUser[id]) {
    return res.status(403).send('You do not have authorization.');
  }

  // Throw an error if No URL was entered.
  if (!longURL) {
    return res.status(400).send('You must provide a URL to proceed.');
  }

  // Update the record in our database.
  urlDatabase[id].longURL = longURL;

  // Log data to the console.
  console.log(`Update Id: ${id}, URL: ${longURL}`);
  console.log(urlDatabase);

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Login Page
 */
app.get("/login", (req, res) => {
  const userId = req.cookies.userId;

  // If the user is logged in, redirect them the Main Page
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[userId],
  };

  res.render("login", templateVars);
});

/**
 * Log the user into the system
 * Actually, we are just setting the cookie.
 */
app.post("/login", (req, res) => {
  // Get the Email and Password from the Request body.
  const email = req.body.email;
  const password = req.body.password;

  // Throw an error if there is no Email or Password
  if (!email || !password) {
    return res.status(403).send('You must provide an email and password to proceed.');
  }

  // Lookup the User based on their email.
  let user = getUserByEmail(email);

  // Error if the Email is not found.
  if (!user) {
    return res.status(403).send('Invalid email.');
  }

  // Error Password does not match.
  if (user.password !== password) {
    return res.status(403).send('Invalid password.');
  }

  // Log data to the console.
  console.log(users);

  // Set the cookie
  res.cookie("userId", user.id);

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Log the user out of the system
 * Actually, we are just removing the cookie.
 */
app.post("/logout", (req, res) => {
  // Clear the cookie.
  res.clearCookie("userId");

  // After completing the POST request, redirect to the main page
  res.redirect('/login');
});

/**
 * Registration Page
 */
app.get("/register", (req, res) => {
  const userId = req.cookies.userId;

  // If the user is logged in, redirect them the Main Page
  if (userId) {
    return res.redirect('/urls');
  }

  const templateVars = {
    user: users[userId],
  };

  res.render("register",templateVars);
});

/**
 * Register the user
 */
app.post("/register", (req, res) => {
  // Get the Email and Password from the Request body.
  const email = req.body.email;
  const password = req.body.password;

  // Throw an error if there is no Email or Password
  if (!email || !password) {
    return res.status(400).send('You must provide an email and password to proceed.');
  }

  // Lookup the User based on their email.
  let user = getUserByEmail(email);

  // Error if the Email already exists.
  if (user) {
    return res.status(409).send('A user with that email already exists.');
  }

  // We passed all the validations. Add the user to the database.
  const id = generateRandomString(6);
  user = {
    id,
    email,
    password,
  };

  // Add the new user to the Users object
  users[id] = user;

  // Log data to the console.
  console.log(users);

  // Set the cookie
  res.cookie("userId", id);

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});


/**
 * Display the info for a specific URL.
 */
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.cookies.userId;

  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // If the user is not logged in, redirect them the Login Page
  if (!userId) {
    return res.redirect('/login');
  }

  // If the user does not own the specific URL, then throw an error.
  const urlObjectsForUser = urlsForUser(userId);
  if (!urlObjectsForUser[id]) {
    return res.status(403).send('You do not have authorization.');
  }

  const longURL = urlDatabase[id].longURL;
  const templateVars = {
    id,
    longURL,
    user: users[req.cookies.userId],
  };

  res.render("urls_show", templateVars);
});

/**
 * Using the Tiny URL, open the long URL.
 */
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  
  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }
  
  const longURL = urlDatabase[id].longURL;
  res.redirect(longURL);
});

/**
 * Our Listener.
 */
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});