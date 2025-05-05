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

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" }); 
    }

    // Store user data
    const result = await userModel.storeDataUser({ name, email, password });

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

//LIST USER   
export const getListUser = async (req, res) => {
  try {
    const result = await userModel.getListUser();
    res.status(200).json({
      status: "200",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting list user",
      error: error.message,
    });
  }
};

//LOGIN
export const login = async(req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
      
      // Call the model's login method
      const result = await userModel.loginUser({ email, password });

      // Handle different response statuses
      if (result.status === "200") {
          return res.status(200).json(result);
      } else if (result.status === "401") {
          return res.status(401).json({ error: result.error });
      } else {
          return res.status(500).json({ error: result.error });
      }
  } catch (error) {
      return res.status(500).json({ error: error.message });
  }
}