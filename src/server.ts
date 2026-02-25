import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';


dotenv.config();

const PORT = process.env.PORT;
const startServer = async () => {
  try{await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }catch(error){
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer();