// Importing the Cloudinary for accessing the cloudinary Services
import { v2 as cloudinary } from "cloudinary";

// const cloudinary = require("cloudinary").v2;

// Importing the File System - from node (No Need to Import)
import fs from 'fs';
// const fs = require("fs");
// const { Readable } = require('stream');
import { Readable } from "stream";

import { APIError } from "./apiError.js";

import dotenv from 'dotenv';
// const dotenv = require('dotenv');

dotenv.config({
    path: "../../.env"
})

// MARK: Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// MARK: Function to upload the Local File to the Cloudinary Server
const uploadOnCloudinaryFromLocal = async (localFilePath, folder) => {
    try {

        // If the Local File is NOT Provided
        if (!localFilePath) {
            // Returning null if fails to upload as no file available
            return null;
        }

        // If the Local File Path is Provided, then we will upload the file on the cloudinary
        // As it is been uploaded, so it will take time to upload, so we will use await for that
        const uploadedFileResponse = await cloudinary.uploader.upload(localFilePath, {
            // We have set the resource_type as auto i.e, it will manage by own for any file
            resource_type: 'raw',
            folder: folder
        }, function (error, result) {
            console.log("[src/utils/cloudinary.js] Error : ", error);
            console.log("[src/utils/cloudinary.js] Result : ", result);
        });


        console.log("[src/utils/cloudinary.js] File Uploaded on the Cloudinary, Link : ", uploadedFileResponse.url);
        console.log("[src/utils/cloudinary.js] uploadedFileResponse : ", uploadedFileResponse);

        // Returning the Response that we have got from cloudinary
        return uploadedFileResponse;

    } catch (error) {
        // If any Error Occurs, then first of all we will remove the saved file

        // If File is NOT Uploaded / Upload Fails, then we will remove/delete the file that has been uploaded in local server
        fs.unlinkSync(localFilePath)

        // Returning null if fails to upload
        return null;
    }
}


// MARK: Function to delete the cloudinary file
const deleteCloudinaryFile = async (fileUrl = "", type = "auto", folder = "Images") => {

    try {
        if (!fileUrl) {
            console.log("File URL is Empty");
            return false;
            // return new APIError(400, "File URL is Empty").send(res);
        }
        if (!type || type === "") {
            console.log("File Type is Empty");
            return false;
            // return new APIError(400, "File Type is Empty").send(res);
        }
        if (type === "auto") {
            console.log("Invalid File Type");
            return false;
            // return new APIError(400, "Invalid File Type").send(res);
        }

        // Extracting the File URL to get the public ID from the URL
        const extensionDotLoc = fileUrl.lastIndexOf(".");
        const lastSlashLoc = fileUrl.lastIndexOf("/");

        // Public ID of the Image
        const publicID = fileUrl.slice(lastSlashLoc + 1, extensionDotLoc)
        console.log("[src/utils/cloudinary.js] Public ID : ", folder + "/" + publicID);

        // Destroying the File and waiting for the response
        const deleteResponse = await cloudinary.uploader.destroy(folder + "/" + publicID, {
            resource_type: type,
        }, function (error, result) {
            console.log("[src/utils/cloudinary.js] Error : ", error);
            console.log("[src/utils/cloudinary.js] Result : ", result);
        })

        console.log("[src/utils/cloudinary.js] Response : ", deleteResponse)

        // Returning True if file deleted successfully else false
        return deleteResponse?.result === "ok";

    } catch (error) {

        // Error
        console.log("[src/utils/cloudinary.js] Error : ", error.message);

        return false;
    }
}

const uploadOnCloudinaryFromBuffer = async (fileBuffer, folder) => {

    const streamUpload = () => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: folder, // optional
                    resource_type: 'raw'
                },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );
            Readable.from(fileBuffer).pipe(stream);
        });
    };

    const result = await streamUpload();
    console.log("File Uploaded on Cloudinary !!");
    return result;

};

// Exporting the Cloudinary Function
export {
    uploadOnCloudinaryFromLocal,
    deleteCloudinaryFile,
    uploadOnCloudinaryFromBuffer
}