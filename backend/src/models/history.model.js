// This file defines the structure for our "histories" collection in MongoDB.
// We're using Mongoose, which helps us create a "schema" or blueprint for our data.
// This ensures that every document in the collection has a consistent structure.
const mongoose = require('mongoose');

/**
 * HistorySchema
 * 
 * Each document created with this schema will represent a single "claim points" event.
 * It's a log entry that answers: "Who claimed points? How many? And when?"
 */
const HistorySchema = new mongoose.Schema({
  
  // 'userId' stores a reference to the user who performed this action.
  userId: {
    // We are storing the unique ID (_id) of a document from another collection.
    // This is similar to a "foreign key" in SQL databases.
    type: mongoose.Schema.Types.ObjectId,
    
    // The 'ref' option is very important. It tells Mongoose, "This ID belongs
    // to a document in the 'User' collection." This allows us to easily
    // 'populate' or fetch the full user details (like their name) later on.
    ref: 'User',
    
    // We make this field required because a history entry without a user
    // doesn't make any sense.
    required: true,
  },
  
  // 'pointsClaimed' stores the exact number of points that were awarded in this specific event.
  pointsClaimed: {
    type: Number,
    required: true, // This is essential information, so it must be included.
  },
  
  // 'timestamp' records the exact date and time when the claim occurred.
  timestamp: {
    type: Date,
    
    // The 'default' option is a handy Mongoose feature. If we create a new
    // history document without specifying a timestamp, Mongoose will automatically
    // fill it with the current date and time.
    default: Date.now,
  },
});

// Finally, we export the model.
// Mongoose takes our schema and creates a model object from it. This model is what
// we'll use in our controller files to interact with the 'histories' collection
// in the database (e.g., creating new entries, finding old ones).
// The first argument, 'History', will be turned into a collection named 'histories' by Mongoose.
module.exports = mongoose.model('History', HistorySchema);