import {Schema, model, Types} from 'mongoose';


export enum ReminderType {
  Appointment = 'appointment',
  Event = 'event',
  Idea = 'idea',
  Medication = 'medication',
  Other = 'other',
  Test = 'test',
  Task = 'task',
}
export interface IReminder {
  title: string;
  description?: string;
  type: ReminderType;
  dueDate?: Date;
  author: Types.ObjectId;
  sharedWith: Types.ObjectId[];
  isArchived: boolean;
}

const reminderSchema = new Schema<IReminder>({
  title: {type: String, required: true, trim: true},
  description: {type: String},
  type: {type: String, enum: Object.values(ReminderType), required: true},
  author: {type: Types.ObjectId, ref: 'User', required: true},
  sharedWith:{ type:[{type: Types.ObjectId, ref:'User'}], default: []},
  isArchived: {type: Boolean, default: false},
  dueDate: {type: Date},
},
{timestamps: true,});

export const reminderModel = model<IReminder>('Reminder', reminderSchema);

