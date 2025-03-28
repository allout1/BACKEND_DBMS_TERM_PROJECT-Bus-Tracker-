import mongoose, { Mongoose } from "mongoose";
import { MONGO_DB_NAME, MONGO_URI } from "../../../secret";

class BUS_TRACKER_DB { // Singleton class to connect to the database
    private mongoConn!: Mongoose;
    constructor() {
        // this.mongoConn = new Mongoose();
    }

    // Get the connection to the database
    async getConnection(): Promise<Mongoose> {
        try {
            this.mongoConn = await mongoose.connect(`${MONGO_URI}/${MONGO_DB_NAME}`);
            return this.mongoConn;
        }
        catch (error) {
            console.log("Database Connection Error: ", error);
            throw error;
        }
    }
}

export default new BUS_TRACKER_DB();