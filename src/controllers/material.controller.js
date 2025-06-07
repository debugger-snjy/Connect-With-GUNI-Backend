import { validationResult } from "express-validator";
import Material from "../models/material.model.js";
import { APIError } from "../utils/apiError.js";
import { APIResponse } from "../utils/apiResponse.js";
import { deleteCloudinaryFile, uploadOnCloudinaryFromBuffer } from "../utils/cloudinary.js";
import { getFileTypeFromExtension } from "../utils/fileType.js";

// For Uploading the Material
export const uploadMaterial = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Material NOT Uploaded Successfully";

    try {
        // Getting the Results after validations
        const errors = validationResult(req);

        // If we have errors, sending bad request with errors
        if (!errors.isEmpty()) {
            msg = "Material Not Uploaded Successfully"
            // sending the errors that are present
            return res.status(400).json(new APIError(400, msg, errors.array()));
        }

        if (req.file) {
            console.log(req.file)
            // Handle the uploaded file

            const extension = req.file.originalname.toString().split('.').pop().toLowerCase();
            const searchMaterial = await Material.find({ subject: req.body.subject, title: req.file.originalname.toString(), sem: req.body.sem })

            if (searchMaterial.length === 0) {
                const fileBuffer = req.file.buffer;

                const cloudinaryResponse = await uploadOnCloudinaryFromBuffer(fileBuffer, "Connect With GUNI/Materials/" + req.body.uploadername.toUpperCase() + '/Sem ' + req.body.sem.toString())
                console.log("Material Link Uploaded : ", cloudinaryResponse.secure_url);
                const newMaterial = new Material({
                    subject: req.body.subject,
                    title: req.file.originalname.toString(),
                    file: cloudinaryResponse.secure_url,
                    uploadedBy: req.body.uploadername,
                    sem: req.body.sem,
                    type: getFileTypeFromExtension(req.file.originalname.toString())
                })
                console.log("Test 6")
                const materialSaved = await newMaterial.save()
                if (materialSaved) {
                    console.log("Yes !")
                    msg = "Material is Uploaded Successfully !";
                } else {
                    console.log("No!")
                    msg = "Material is NOT Uploaded Successfully !";
                }
                console.log("Test 7")
                return res.json(new APIResponse(200, newMaterial, msg));
            } else {
                // Setting up the parameters
                msg = "File is already Uploaded !"
                console.log("Test 8")
                return res.status(409).json(new APIError(409, msg));
            }
        } else {
            let error = "File is Missing !"
            msg = "File Has NOT Been Uploaded Successfully !"
            return res.status(400).json(new APIError(400, msg, error));
        }
    }
    catch (error) {
        // Handle other errors
        console.error('Error:', error.message);
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching All Materials - GET Request
export const fetchAllMaterials = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "All Materials has NOT Fetched Successfully";

    try {
        const allMaterials = await Material.find({}).lean();

        if (allMaterials.length !== 0) {
            // Setting up the parameters
            msg = "All Materials has been Fetched Successfully"
            // Finding all the Subjects
            console.log(allMaterials)
        }

        return res.json(new APIResponse(200, allMaterials, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Deleting Material - DELETE Request
export const deleteMaterial = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Material has NOT Deleted Successfully";

    try {
        // Finding the subject from the database, whether the subject exists or not
        // To access the key from the url, we use req.params.<key>
        // Here, we access the id from the url, we use req.params.id
        const material = await Material.findById(req.params.materialid);

        // If that subject doesn't exists, then returning the Bad Response
        if (!material) {
            msg = "Material Record Not Found"
            return res.status(404).json(new APIError(404, msg, "Material Record Not Found !"))
        }

        const deletedMaterial = await Material.findByIdAndDelete(req.params.materialid);

        // If the Material is deleted successfully, Deleting the Material from the Cloudinary
        if (deleteMaterial) {
            var result = await deleteCloudinaryFile(deletedMaterial.file, "raw", "Connect With GUNI/Materials/" + deleteMaterial.uploadedBy.toString().toUpperCase() + '/Sem ' + deleteMaterial.sem.toString());

            if (!result) {
                console.log("Error in Deleting the Material (" + deletedMaterial.file + ") from Cloudinary Server");
            }
        }

        msg = "Material has been Deleted Successfully"

        return res.json(new APIResponse(200, deletedMaterial, msg));
    }
    catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        msg = "Material Not Deleted Successfully"
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}

// For Fetching Subject Material Files - POST Request
// Full Route : /pai/student/fetch/material/:subjectname
export const fetchSubjectMaterial = async (req, res) => {
    // Making a Variable to track the success or not
    let msg = "Subject Material has NOT Fetched Successfully";

    // console.log("Request Parameters : Sem - ",req.body," Subject - ",req.params.subjectname)

    try {
        // Finding all the Subjects
        const allSubjectMaterial = await Material.find({ sem: req.body.sem, subject: req.params.subjectname });

        if (allSubjectMaterial.length !== 0) {
            // Setting up the parameters
            msg = "All Subject Material has been Fetched Successfully"
            // Finding all the Subjects 
            console.log(allSubjectMaterial)
        }

        return res.json(new APIResponse(200, allSubjectMaterial, msg));
    } catch (error) {
        console.log("Error Occured !")
        console.error("Error : ", error.message)
        return res.status(500).json(new APIError(500, msg, error.message));
    }
}