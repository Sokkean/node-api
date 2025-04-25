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
    
}

export default userModel;