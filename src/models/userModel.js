import pool from "../db/db.js";
import bcrypt from 'bcrypt';
 

class userModel { 

    static async storeDataUser(data) {
        const { name, email, password } = data;
    
        // Hash the password
        const saltRounds = 10; // Salt rounds for security
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email`;
        const values = [name, email, hashedPassword];
    
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    
}

export default userModel;