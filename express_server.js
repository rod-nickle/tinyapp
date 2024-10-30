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
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "a@a.com",
    password: "1234",
  },
  user2RandomID: {
    id: "user2RandomID",
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
  let user = null;

  // Lookup the User based on their Email
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
 * Display our Main Page
 */
app.get("/urls", (req, res) => {
  // Display Cookies
  console.log('Cookies: ', req.cookies);

  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.userId],
  };
  res.render("urls_index", templateVars);
});


/**
 * Display the New URL Page
 */
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userId],
  };
  res.render("urls_new", templateVars);
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
  const email = req.body.email;

  if (!email) {
    console.log(`Email field is empty.`);
    return res.status(400).send("Email field is empty.");
  }
  
  // Log data to the console.
  console.log(`Email: ${email}`);
  
  // Lookup the User based on their email.
  const user = getUserByEmail(email);

  if (!user) {
    return res.status(400).send(`The email entered cannot be found.`)
  }
  res.cookie("userId", user.id);
  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Log the user out of the system
 * Actually, we are just removing the cookie.
 */
app.post("/logout", (req, res) => {
  userId = req.cookies.userId;

  // Log data to the console.
  console.log(`Removing UserId: ${userId}`);
  
  res.clearCookie("userId");
  // After completing the POST request, redirect to the main page
  res.redirect('/urls');
});

/**
 * Registration Page
 */
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies.userId],
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
    return res.status(400).send('A user with that email already exists.');
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
  console.log(`New Id: ${id}, Email: ${email} Password: ${password}`);
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
  const longURL = urlDatabase[id];
  const templateVars = {
    id: id,
    longURL: longURL,
    user: users[req.cookies.userId],
  };

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