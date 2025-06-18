import pool from "../db/db.js";
import bcrypt from 'bcrypt';
import mailer from '../service/mailer.js';
 

class userModel { 
    static async storeDataUser(data) {
        const { name, email, password } = data;

        // 1. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        
        // 2. Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP code is: ${otp}`
        };
        
        try {
            await mailer.sendMail(mailOptions);
            
        } catch (error) {
        console.error('❌ Error sending OTP email:', error.message);
        throw new Error('Failed to send OTP email');
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert user
        try {
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id`;
        const values = [name, email, hashedPassword];
        const result = await pool.query(query, values);

        // 5. Return user id + otp for next step
        return {
            userId: result.rows[0].id,
            otp: otp // ❗ remove this in production
        };
        } catch (error) {
        console.error('❌ DB Insert Error:', error.message);
        throw new Error('Database insert failed');
        }
    }

    //find user by email
    static async findUserByEmail(email) {
        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
    //generate otp
    static async generateOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp;
    }

    //get list users
    static async getListUser() {
        const query = `SELECT id , name , email, gender FROM users`;
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
                    token_type: "Bearer"	
                }
            };

        } catch (err) {
            return {
                status: "500",
                error: err.message
            };
        }
    }
    //** Regiter User with OTP */
    static async registerUserWithOTP(data) {
        try {
            const { name, email, phone, type } = data;

            // ** Check Type Phone or Email */
            if (type == "email") {
                //** Check Email */
                const exituser = await userModel.findUserByEmail(email);
                if (exituser) {
                    return {
                        status: "400",
                        error: "Email already exists"
                    };
                }

                //** Generate OTP */
                const otp = Math.floor(100000 + Math.random() * 900000);

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'OTP Verification',
                    text: `Your OTP code is: ${otp}`
                };
                //** Send Otp */
                try {
                    await mailer.sendMail(mailOptions);
                } catch (error) {
                    console.error('❌ Error sending OTP email:', error.message);
                    throw new Error('Failed to send OTP email');
                }

                //** Insert User */
                const result = `INSERT INTO users (name, email) VALUES (?, ?) RETURNING id`;
                const value = [name, email];
                const resultInsert = await pool.query(result, value);

                return resultInsert[0].id;
            } 

        }catch(error){
            return  {
                status: "500",
                error: error.message
            };
        };
    }
    
}

export default userModel;