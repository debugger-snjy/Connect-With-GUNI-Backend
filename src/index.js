// Now, Importing the connectToMongo function from "db.js"
import connectToMongo from "./db/index.js";

import app from "./app.js";

// Checking for the connection
connectToMongo()
    .then(() => {
        // Now, Here we are going to use the app object and start the server
        // If the app is not working or having errors
        app.on("error", (error) => {
            console.log("[src/index.js] Errors : ", error);
            throw error;
        })

        // Application Listening Code
        app.listen(process.env.PORT, () => {
            console.log(`[src/index.js] ${process.env.APPNAME} is Listening on PORT ${process.env.PORT} ⚙️  `);
        })

    })
    .catch((err) => {
        console.log("[src/index.js] Mongo DB Connection Failed !!", err);
    })