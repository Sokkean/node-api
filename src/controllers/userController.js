import userModel from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { name, email, password } = req.body;

    // Validate input data
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Store user data
    const result = await userModel.storeDataUser({ name, email, password });
    console.log(result);
    res.status(201).json({
      status: "200",
      data: {
        message: "User created successfully",
        insert_data_success: result,
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
