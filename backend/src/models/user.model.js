// This file defines the structure for our "users" collection in MongoDB.
// Using a Mongoose schema ensures that all user documents in our database
// have the same fields and data types, which keeps our data clean and predictable.
const mongoose = require('mongoose');

/**
 * UserSchema
 * 
 * This schema represents a single user in our leaderboard system.
 * It holds the essential information for each participant: their name and their score.
 */
const UserSchema = new mongoose.Schema({
  
  // 'name' will store the user's display name.
  name: {
    // The data type for the name is a String.
    type: String,
    
    // We make this field required because a user must have a name.
    required: true,
    
    // 'unique: true' is a crucial setting. It tells MongoDB to enforce that
    // no two users can have the same name. This prevents duplicate entries.
    // Mongoose will create a unique index in the database for this field.
    unique: true,
    
    // 'trim: true' is a nice quality-of-life feature. It automatically removes
    // any extra whitespace from the beginning or end of a name before saving it.
    // For example, "  Rahul  " would be saved as "Rahul".
    trim: true,
  },
  
  // 'totalPoints' keeps track of the user's cumulative score.
  totalPoints: {
    // The score will be stored as a Number.
    type: Number,
    
    // 'default: 0' is a very useful setting. It ensures that when a new user
    // is created, their `totalPoints` will automatically be set to 0
    // if we don't provide a specific value.
    default: 0,
  },
});

// We now export the Mongoose model.
// This model is the primary tool we'll use in our controllers to perform CRUD
// (Create, Read, Update, Delete) operations on the 'users' collection.
// Mongoose will automatically name the collection 'users' (plural and lowercase)
// based on the 'User' string we provide here.
module.exports = mongoose.model('User', UserSchema);