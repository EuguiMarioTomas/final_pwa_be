import { Schema, model } from 'mongoose';

export interface IUser{
  userName: string;
  email: string;
  isActive?: boolean;
  firebaseUid: string;
};

const userSchema = new Schema<IUser>({
  userName:{type: String, required: true},
  email:{type: String, required: true, unique: true},
  isActive:{type: Boolean, default: true},
  firebaseUid:{type: String, required: true, unique: true},
});

const userModel = model<IUser>('User', userSchema);
export default userModel;
