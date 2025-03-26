import express from 'express'
import cors from 'cors'
import cookie from 'cookie-parser'
import { ENV_FE_BASE_URL, ENV_PORT } from './secret';
import RouterConfig from './src/config/router_config';
import BUS_TRACK_DB from './src/config/db/db.config';

const app: express.Application = express();
const port = ENV_PORT;

app.use(cors({
    origin: [
        `${ENV_FE_BASE_URL}`
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());


// Configure the routes
const routerConfig = new RouterConfig(app);
routerConfig.configureRoutes();

// Connect the database
const dbConn = BUS_TRACK_DB.getConnection().then((conn)=>{
    console.log("Database BUS TRACKER Connected");
});

// Listen on the server
const runningMessage = `Server running at port : ${port}`

app.listen(port, () => {
    console.log(runningMessage);
});