const { assert } = require('chai');
const { getUserByEmail, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

/**
 * Test getUserByEmail
 */
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID); 
  });

  it('should return a user with the correct email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedEmail = "user@example.com";
    assert.strictEqual(user.email, expectedEmail); 
  });

  it('should return undefined with an invalid email', function() {
    const user = getUserByEmail("usernotfound@example.com", testUsers)
    assert.strictEqual(user, undefined); 
  });
});


/**
 * Test urlsForUser 
 */

// Sample urlDatabase
const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
  "9sm5xK": { longURL: "http://www.google.com", userId: "user2" },
  "6fg7hJ": { longURL: "http://www.example.com", userId: "user1" }
};

describe('urlsForUser', function() {
  it('should return URLs that belong to the specified user', function() {
    const userId = "user1";
    const expectedOutput = {
      "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userId: "user1" },
      "6fg7hJ": { longURL: "http://www.example.com", userId: "user1" }
    };

    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput);
  });

  it('should return an empty object if the user has no urls', function() {
    const userId = "user3";
    const expectedOutput = {};

    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput);
  });

  it('should return an empty object if there are no urls in the urlDatabase', function() {
    const userId = "user1";
    const emptyDatabase = {};
    const expectedOutput = {};

    const result = urlsForUser(userId, emptyDatabase);
    assert.deepEqual(result, expectedOutput);
  });

  it('should not return urls that don\'t belong to the specified user', function() {
    const userId = "user2";
    const expectedOutput = {
      "9sm5xK": { longURL: "http://www.google.com", userId: "user2" }
    };

    const result = urlsForUser(userId, urlDatabase);
    assert.deepEqual(result, expectedOutput);
  });
});

