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
 * @param {*} usersDatabase A database object of Users
 * @returns The User object if found; otherwise, NULL.
 */
const getUserByEmail = (email, usersDatabase) => {
  for (const userId in usersDatabase) {
    const user = usersDatabase[userId];
    if (user.email === email) {
      // We found our user!
      return user;
    }
  }
};


/**
 * This function returns a new object of URLs filtered by the userId
 * of the owner
 * @param {*} userId The Id of the currently logged in User
 * @param {*} urlDatabase A database object of URLs
 * @returns A object of URLs for which he owns.
 */
const urlsForUser = (userId, urlDatabase) => {
  const urlObjectsForUser = {};

  // Loop through all URLs in our database.
  // If the userId matches, add the object to our new object of URLS.
  for (const databaseId in urlDatabase) {
    if (urlDatabase[databaseId].userId === userId) {
      urlObjectsForUser[databaseId] = urlDatabase[databaseId];
    }
  }

  return urlObjectsForUser;
};

module.exports = {generateRandomString, getUserByEmail, urlsForUser};
