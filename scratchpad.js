const generateRandomString = function(charactersLength) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < charactersLength; i++) {
    // Generate a Random Number within the length of available characters.
    let randomNumber = Math.floor(Math.random() * characters.length);

    // Grab the character at that position and add it to our result.
    result += characters.charAt(randomNumber);
  }
  return result;
};

console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));
console.log(generateRandomString(6));