import pool from "../db/db.js";
import bcrypt from 'bcrypt';
 

class userModel { 

    // store user data
    static async storeDataUser(data) {
        const { name, email, password } = data;
    
        // Hash the password
        const saltRounds = 10; // Salt rounds for security
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
        const values = [name, email, hashedPassword];
    
        const result = await pool.query(query, values);
        return result.rows[0]["id"];	
    }

    //find user by email
    static async findUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    //get list users
    static async getListUser() {
        const query = `SELECT * FROM users`;
        const result = await pool.query(query);
        return result.rows;
    }
    
    //Login user
    static async loginUser(data) {
        try {
            const { email, password } = data;
            const user = await userModel.findUserByEmail(email);
            
            // Check if the user exists
            if (!user) {
                return {
                    status: "401",
                    error: 'User not found'
                };
            }
            
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return {
                    status: "401",
                    error: 'Invalid password'
                };
            }

            // Import jwt at the top of the file
            // import jwt from 'jsonwebtoken';
            const jwt = await import('jsonwebtoken');
            
            const token = jwt.default.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            return {
                status: "200",
                data: {
                    message: "Login successfully",
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    token: token,
                }
            };

        } catch (err) {
            return {
                status: "500",
                error: err.message
            };
        }
    }
    
}

export default userModel;