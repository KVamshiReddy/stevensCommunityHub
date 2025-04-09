import express from 'express';
import User from '../models/user.model.js';
import { isValidEmail } from '../utils/validation.utils.js';
import { isValidObjectId } from 'mongoose';

//jusrt create all the functions but don't implement them yet

// Create a new user
//Harshil
export const createUser = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    // console.log(req.body);
    
    // if (!firstName || !lastName || !email || !password) {
    //     return res.status(400).json({ message: 'Please provide all required fields' });
    // }
    // if (password.length < 8) {
    //     return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    // }
    // if (password.length > 1024) {
    //     return res.status(400).json({ message: 'Password must be less than 1024 characters long' });
    // }
    // if (firstName.length < 2) {
    //     return res.status(400).json({ message: 'First name must be at least 2 characters long' });
    // }
    // if (firstName.length > 50) {
    //     return res.status(400).json({ message: 'First name must be less than 50 characters long' });
    // }
    // if (lastName.length < 2) {
    //     return res.status(400).json({ message: 'Last name must be at least 2 characters long' });
    // }
    // if (lastName.length > 50) {
    //     return res.status(400).json({ message: 'Last name must be less than 50 characters long' });
    // }
    // if(firstName.trim().length === 0 || lastName.trim().length === 0) {
    //     return res.status(400).json({ message: 'First name and last name cannot be empty' });
    // }
    // if (email.trim().length === 0) {
    //     return res.status(400).json({ message: 'Email cannot be empty' });
    // }
    // if (password.trim().length === 0) {
    //     return res.status(400).json({ message: 'Password cannot be empty' });
    // }
    // const isUserAlreadyExists=await User.findOne({$or:[{email},{firstName},{lastName}]});
    // if (isUserAlreadyExists) {
    //     return res.status(400).json({ message: 'User already exists' });
    // }
    // if (!isValidEmail(email)) {
    //     return res.status(400).json({ message: 'Invalid email format' });
    // }

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error', error });
    }

};
// Get all users
//Harshil
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshToken');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }

};
// Get a user by ID
//Vamshi
export const getUserById = async (req, res) => {

};
// Update a user by ID
//Vamshi
export const updateUser = async (req, res) => {

};
// Delete a user by ID
//Vamshi
export const deleteUser = async (req, res) => {

};
// Login a user
//Harshil
export const loginUser = async (req, res) => {
    let { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    if (email.trim().length === 0) {
        return res.status(400).json({ message: 'Email cannot be empty' });
    }
    if (password.trim().length === 0) {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (password.length > 1024) {
        return res.status(400).json({ message: 'Password must be less than 1024 characters long' });
    }
    if (password.trim().length === 0) {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }
    const user=await User.findOne({email});
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken
    });
};
// Logout a user
//Harshil
export const logoutUser = async (req, res) => {
    try{
        const {refreshToken} = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Please provide refresh token' });
        }
        if (refreshToken.trim().length === 0) {
            return res.status(400).json({ message: 'Refresh token cannot be empty' });
        }   
        await User.findOneAndUpdate(
            { refreshToken },
            { refreshToken: null },
            { new: true }
        );
        res.status(200).json({ message: 'Logout successful' });

    }catch (error) {
        res.status(500).json({ message: 'Internal server error while logging out', error });
    }
};
// Refresh token
//Harshil
export const generateTokens= async (userId) => {
    try{
        const user= await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: true});

        return { accessToken, refreshToken };

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error while generating tokens', error });
    }
};
//update user password
//David
export const updatePassword = async (req, res) => {
};
//Update user Role
//David
export const updateUserRole = async (req, res) => {
};
//Get user by email
//David
export const getUserByEmail = async (req, res) => {
};
//Search user by name
//Akbar
export const searchUserByName = async (req, res) => {
};
//Get all users by role
//Akbar
export const getUsersByRole = async (req, res) => {
};