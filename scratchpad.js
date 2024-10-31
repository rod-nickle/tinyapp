// const generateRandomString = function(charactersLength) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
  
//   for (let i = 0; i < charactersLength; i++) {
//     // Generate a Random Number within the length of available characters.
//     let randomNumber = Math.floor(Math.random() * characters.length);

//     // Grab the character at that position and add it to our result.
//     result += characters.charAt(randomNumber);
//   }
//   return result;
// };

// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));
// console.log(generateRandomString(6));



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

console.log('This is ourn new object:', urlsForUser("Hh65Sm"));
