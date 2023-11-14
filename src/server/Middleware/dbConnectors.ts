import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbReader = process.env.DB_READER;
const dbReaderPass = process.env.DB_READER_PASSWORD;

const connectReader = () => {
    mongoose.connect(
        `mongodb+srv://${dbReader}:${dbReaderPass}@sound-technicians-portf.zlzzftd.mongodb.net/?retryWrites=true&w=majority`,
    );
};

export default {connectReader};