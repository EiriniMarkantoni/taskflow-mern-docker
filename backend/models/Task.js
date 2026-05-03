// Φέρνουμε τη βιβλιοθήκη mongoose (για MongoDB)
const mongoose = require("mongoose");

// Δημιουργούμε το schema (δομή) του Task
const taskSchema = new mongoose.Schema(
  {
    // Τίτλος task
    title: {
      type: String,
      required: true, // υποχρεωτικό πεδίο
      trim: true, // αφαιρεί κενά
    },

    // Περιγραφή
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Κατηγορία (π.χ. Work, Personal)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Προτεραιότητα
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"], // επιτρεπόμενες τιμές
      default: "Medium",
    },

    // Κατάσταση task
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    // Deadline
    deadline: {
      type: Date,
      required: true,
    },
  },

  // timestamps = createdAt & updatedAt
  { timestamps: true }
);

// Εξάγουμε το model για χρήση αλλού
module.exports = mongoose.model("Task", taskSchema);