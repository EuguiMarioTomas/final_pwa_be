import { reminderModel } from "../models/reminderModel.js";
import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import mongoose from "mongoose";
interface IdParams { id: string };

//Create a new reminder
const createReminder = async (req: Request, res: Response) => {
  try{
    const{title, description, type, dueDate, author} = req.body;
    if(!mongoose.Types.ObjectId.isValid(author)){
      res.status(400).json({message: 'Invalid author ID', error: true});
      return;
    };
    const existingUser = await userModel.findById(author);
    if(!existingUser){
      res.status(404).json({message: 'Author not found', error: true});
      return;
    };
    const newReminder = new reminderModel({title, description, type, dueDate, author: author, sharedWith: []});
    if(!title || !type){
      res.status(400).json({message: 'Title and type are required', error: true});
      return;
    }
    await newReminder.save();
    res.status(201).json({message: 'Reminder created successfully', data: newReminder, error: false});
  }catch(error){
    res.status(500).json({message: 'Error creating reminder', error: true});
  }
};

//Get reminder by user
const getUserReminder = async (req: Request<IdParams>, res: Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid user ID', error: true});
      return;
    };
    const reminders = await reminderModel.find({author: id, isArchived: false}).populate('author', 'userName email');
    res.status(200).json({message: 'Reminders retrieved successfully', data: reminders, error: false});
  }catch(error){
    res.status(500).json({message: 'Error retrieving reminder', error: true});
  }
}

//Get shared reminders for a user
const getSharedReminders = async (req: Request<IdParams>, res: Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid user ID', error: true});
      return;
    };
    const reminders = await reminderModel.find({sharedWith:id, isArchived: false}).populate('author', 'userName email');
    res.status(200).json({message: 'Shared reminders retrieved successfully', data: reminders, error: false});
  }catch(error){
    res.status(500).json({message: 'Error retrieving shared reminders', error: true});
  }
}

//Get archived reminders for a user
const getUserArchivedReminders = async (req: Request<IdParams>, res: Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid user ID', error: true});
      return;
    };
    const reminder = await reminderModel.find({author: id, isArchived: true}).populate('author', 'userName email');
    res.status(200).json({message: 'Archived reminders retrieved successfully', data: reminder, error: false});
  }catch(error){
    res.status(500).json({message: 'Error retrieving archived reminders', error: true});
  }
}

//update reminder
const updateReminder = async (req: Request<IdParams>, res: Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid reminder ID', error: true});
      return;
    };
    const reminder = await reminderModel.findById(id);
    if(!reminder){
      res.status(404).json({message: 'Reminder not found', error: true});
      return;
    };
    const {title, description, type, dueDate} = req.body;
    if(title != undefined) reminder.title = title;
    if(description != undefined) reminder.description = description;
    if(type != undefined) reminder.type = type;
    if(dueDate != undefined) reminder.dueDate = dueDate;
    await reminder.save();
    res.status(200).json({message: 'Reminder updated successfully', data: reminder, error: false});
  }catch(error){
    res.status(500).json({message: 'Error updating reminder', error: true});
  }
}

//Shred a reminder with another user
const shareReminder = async (req: Request, res: Response) => {
  try{
    const {reminderId, userId} = req.body;
    if(!mongoose.Types.ObjectId.isValid(reminderId)|| !mongoose.Types.ObjectId.isValid(userId)){
      res.status(400).json({message: 'Invalid reminder ID or user ID', error: true});
      return;
    };
    const user = await userModel.findById(userId);
    if(!user){
      res.status(404).json({message: 'User not found', error: true});
      return;
    };
    const reminder = await reminderModel.findById(reminderId);
    if(!reminder){
      res.status(404).json({message: 'Reminder not found', error: true});
      return;
    };
    if(!reminder.sharedWith.some(id=>id.toString() === userId)){
      reminder.sharedWith.push(new mongoose.Types.ObjectId(userId));
      await reminder.save();
    }
    res.status(200).json({message: 'Reminder shared successfully', data: reminder, error: false});
  }catch(error){
    res.status(500).json({message: 'Error sharing reminder', error: true});
  }
}

//soft delete reminder
const softDeleteReminder = async (req:Request<IdParams>, res: Response) => {
  try{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      res.status(400).json({message: 'Invalid reminder ID', error: true});
      return;
    }
    const reminder = await reminderModel.findById(id);
    if(!reminder){
      res.status(404).json({message: 'Reminder not found', error: true});
      return;
    };
    const wasArchived = reminder.isArchived;
    reminder.isArchived = !reminder.isArchived;
    await reminder.save();
    let responseMessage = wasArchived ? 'Reminder unarchived successfully' : 'Reminder archived successfully';
    res.status(200).json({message: responseMessage, data: reminder, error: false});
  }catch(error){
    res.status(500).json({message: 'Error archiving/unarchiving reminder', error: true});
  }
}

export {createReminder, getUserReminder, getSharedReminders, getUserArchivedReminders, updateReminder, shareReminder, softDeleteReminder};