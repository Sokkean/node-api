import userModel from "../models/register.js";
import joi from "joi";
import { format } from "date-fns"; 

class UserController {
    static async registerUser(req, res) {
        try {
            const schema = joi.object({
                name: joi.string().required(),
                email: joi.string().email().required(),
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // Check if user exists
            const existingUser = await userModel.findOne({ where: { email: req.body.email } });
            if (existingUser) {
                return res.status(409).json({ message: "Email already registered" });
            }

            // Create new user
            const createUser = await userModel.create(req.body);

            res.status(201).json({
                message: "User registered successfully",
                user: createUser,
            });
        } catch (err) {
            res.status(500).json({
                message: "Error creating user",
                error: err.message,
            });
        }
    }
    //** get list of users */
    static async getUsers(req, res) {
        try {
            const users = await userModel.findAll();

            const formattedData = users.map(user => ({
                id: user.id,
                name: user.name ?? null,
                email: user.email ?? null,
                phone: user.phone ?? null,
                create_date: user.create_date
                    ? format(new Date(user.create_date), 'dd-MM-yyyy h:m:s p')
                    : null,
            }));

            res.status(200).json({
                status: 200,
                result: formattedData,
            });
        } catch (err) {
            res.status(500).json({
                message: "Error fetching users",
                error: err.message,
            });
        }
    }
    //** Update user */
    static async updateUser(req, res) {
        try {
            const schema = joi.object({
                id: joi.string().required(),
                name: joi.string().required(),
                email: joi.string().email().required(),
            });

            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // Check if user exists
            const existingUser = await userModel.findOne({ where: { id: req.body.id } });
            if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
            }

            // Update user
            const updateUser = await userModel.update(req.body, { where: { id: req.body.id } });

            res.status(200).json({
                message: "User updated successfully",
                status: 200,
                result:[
                    {
                        update_id: updateUser[0],
                    }
                ]
            });
        } catch (err) {
            res.status(500).json({
                message: "Error updating user",
                error: err.message,
            });
        }
    }
}

export default UserController;
