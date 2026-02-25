import userModel from '../models/userModel.js';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
interface IdParams{id: string};

//Create a new user
const createUser = async(req:Request, res:Response) => {
  try{
    const{userName, email, firebaseUid} = req.body;
    if(!firebaseUid || !email || !userName){
      res.status(400).json({message: 'All fields are required', error: true});
      return;
    };
    const existingUser = await userModel.findOne({$or: [{firebaseUid}, {email}]});
    if(existingUser){
      res.status(409).json({message: 'User with this firebaseUid or email already exists', error: true});
      return;
    };
    const newUser = new userModel({userName, email, firebaseUid});
    await newUser.save();
    res.status(201).json({message: 'User created successfully', data: newUser, error: false});
  }
  catch(error){
    res.status(500).json({message: 'Error creating user', error: true});
  }
};

//get user by firebaseUid
const getUserByFirebaseUid = async(req:Request, res:Response) => {
  try{
    const {firebaseUid} = req.params;
    if(!firebaseUid){
      res.status(400).json({message: 'Firebase UID is required', error: true});
      return;
    };
    const user = await userModel.findOne({firebaseUid});
    if(!user){
      res.status(404).json({message: 'User not found', error: true});
      return;
    };
    res.status(200).json({message: 'User retrieved successfully', data: user, error: false});
  }catch(error){
    res.status(500).json({message: 'Error retrieving user', error: true});
  }
};

//get user by id
const getUserById = async(req:Request<IdParams>, res:Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid user ID', error: true});
      return;
    };
    const user = await userModel.findById(id);
    if(!user){
      res.status(404).json({message: 'User not found', error: true});
      return;
    };
    res.status(200).json({message: 'User retrieved successfully', data: user, error: false});
  }catch(error){
    res.status(500).json({message: 'Error retrieving user', error: true});
  }
};

//update user
const updateUser = async(req:Request<IdParams>, res:Response) => {
  try{
    const {id} = req.params;
    const {userName, email, isActive} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid user ID', error: true});
      return;
    }
    const updateData: Partial<{userName: string; email: string; isActive: boolean}> = {};
    if(userName !== undefined) updateData.userName = userName;
    if(email !== undefined) updateData.email = email;
    if(isActive !== undefined) updateData.isActive = isActive;
    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
    if(!updatedUser){
      res.status(404).json({message: 'User not found', error: true});
      return;
    };
    res.status(200).json({message: 'User updated successfully', data: updatedUser, error: false});
  }catch(error){
    res.status(500).json({message: 'Error updating user', error: true});
  }
};



export { createUser, getUserByFirebaseUid, updateUser, getUserById };