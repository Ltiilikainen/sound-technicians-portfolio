import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectReader = async () => {
    const dbReader = process.env.DB_READER;
    const dbReaderPass = process.env.DB_READER_PASSWORD;

    await mongoose.connect(
        `mongodb+srv://${dbReader}:${dbReaderPass}@sound-technicians-portf.zlzzftd.mongodb.net/?retryWrites=true&w=majority`,
        {dbName:'site-content'}
    );
};

const connectWriter = async (database: string) => {
    const dbWriter = process.env.DB_WRITER;
    const dbWriterPass = process.env.DB_WRITER_PASS;

    await mongoose.connect(
        `mongodb+srv://${dbWriter}:${dbWriterPass}@sound-technicians-portf.zlzzftd.mongodb.net/?retryWrites=true&w=majority`,
        {dbName: database}
    );
};

const disconnect = () => {
    mongoose.disconnect();
};

export default {connectReader, connectWriter, disconnect};