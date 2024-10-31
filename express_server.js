const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {generateRandomString, getUserByEmail, urlsForUser} = require("./helpers");
const PORT = 8080; // default port 8080
const app = express();

// Configurations
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  keys: ["54RFZBOWXbv2dp979wqM"],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
}));


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
    password: bcrypt.hashSync("1234", 10),
  },
  Hh65Sm: {
    id: "Hh65Sm",
    email: "b@b.com",
    password: bcrypt.hashSync("1234", 10),
  },
};


/**
 * Display our Main Page
 */
app.get("/urls", (req, res) => {
  const userId = req.session.userId;

  // If the user is logged in, redirect them to the Login Page
  if (!userId) {
    return res.redirect('/login');
  }

  // Get the list of URLs owned by the current user.
  const urlObjectsForUser = urlsForUser(userId, urlDatabase);

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
  const userId = req.session.userId;

  // If the user is logged in, redirect them to the Login Page
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
  const userId = req.session.userId;
  const longURL = req.body.longURL;

  // Throw an error message if the user is NOT logged in.
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // Throw an error if No URL was entered.
  if (!longURL) {
    return res.status(400).send('You must provide a URL to proceed.');
  }

  // Create the short URL by generating a random string.
  const id = generateRandomString(6);
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
  const userId = req.session.userId;
  
  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // Throw an error if the user is NOT logged in.
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // Throw an error if the user does not own the specific URL.
  const urlObjectsForUser = urlsForUser(userId, urlDatabase);
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
app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const longURL = req.body.longURL;
  const userId = req.session.userId;
  
  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // Throw an error if the user is NOT logged in.
  if (!userId) {
    return res.status(401).send('You must login to proceed.');
  }

  // Throw an error if the user does not own the specific URL.
  const urlObjectsForUser = urlsForUser(userId, urlDatabase);
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
  const userId = req.session.userId;

  // If the user is logged in, redirect them to the Main Page.
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
  const email = req.body.email;
  const password = req.body.password;

  // Throw an error if there is no Email or Password.
  if (!email || !password) {
    return res.status(400).send('You must provide an email and password to proceed.');
  }

  // Lookup the User based on their email.
  let user = getUserByEmail(email, users);

  // Throw an error if the Email is not found.
  if (!user) {
    return res.status(401).send('Invalid email.');
  }

  // The password stored in the database is hashed.
  const hashedPassword = user.password;

  // Does the password that is entered match the hashed password in our database?
  const isPasswordMatch = bcrypt.compareSync(password, hashedPassword);

  // Throw an error if the Password does not match.
  if (!isPasswordMatch) {
    return res.status(401).send('Invalid password.');
  }

  // Log data to the console.
  console.log(users);

  // Set the cookie
  req.session.userId = user.id;

  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Log the user out of the system
 * Actually, we are just removing the cookie.
 */
app.post("/logout", (req, res) => {
  // Clear the cookie.
  req.session = null;

  // After completing the POST request, redirect to the main page
  res.redirect('/login');
});

/**
 * Registration Page
 */
app.get("/register", (req, res) => {
  const userId = req.session.userId;

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
  const email = req.body.email;
  const password = req.body.password;

  // Throw an error if there is no Email or Password.
  if (!email || !password) {
    return res.status(400).send('You must provide an email and password to proceed.');
  }

  // Lookup the User based on their email.
  let user = getUserByEmail(email, users);

  // Throw an error if the Email already exists.
  if (user) {
    return res.status(400).send('A user with that email already exists.');
  }

  // Hash the password.  This is what will be saved.
  const hashedPassword = bcrypt.hashSync(password, 10);

  // We passed all the validations. Add the user to the database.
  const id = generateRandomString(6);
  user = {
    id,
    email,
    password: hashedPassword,
  };

  // Add the new user to the Users object
  users[id] = user;

  // Log data to the console.
  console.log(users);

  // Set the cookie
  req.session.userId = id;

  // After completing the POST request, redirect to the main page.
  res.redirect('/urls');
});


/**
 * Display the info for a specific URL.
 */
app.get("/urls/:id", (req, res) => {
  const id = req.params.id;
  const userId = req.session.userId;

  // Throw an error if Id is invalid.
  if (!id || !urlDatabase[id]) {
    return res.status(400).send('You must provide a valid Tiny URL.');
  }

  // If the user is not logged in, redirect them the Login Page.
  if (!userId) {
    return res.redirect('/login');
  }

  // Throw an error if the user does not own the specific URL.
  const urlObjectsForUser = urlsForUser(userId, urlDatabase);
  if (!urlObjectsForUser[id]) {
    return res.status(403).send('You do not have authorization.');
  }

  const longURL = urlDatabase[id].longURL;
  const templateVars = {
    id,
    longURL,
    user: users[req.session.userId],
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
 * 
 */
app.get("/", (req, res) => {
  // Redirect to our Main Page.
  res.redirect('/urls');
});

/**
 * Our Listener.
 */
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});