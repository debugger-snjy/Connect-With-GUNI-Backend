import path from 'path';

// Function to check for the string is a text or not
function isAlphaString(input) {

    // Define a regular expression pattern for the date format
    const alphaPattern = /^[a-zA-Z ]+$/;

    // Use the test() method to check if the input string matches the pattern
    return alphaPattern.test(input);
}

// Function to check the extension of the Uploaded file
function isExcelFile(filePath) {
    const ext = path.extname(filePath);

    // Check if the file extension is .xlsx (case-insensitive)
    return ext.toLowerCase() === '.xlsx';
}

function getFileTypeFromExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
        case 'tiff':
        case 'svg':
            return 'image';
        case 'pdf':
            return 'pdf';
        case 'xls':
        case 'xlsx':
            return 'excel';
        case 'doc':
        case 'docx':
            return 'doc';
        case 'mp3':
        case 'wav':
            return 'audio';
        // Add more extensions and types as needed.
        default:
            return 'unknown';
    }
}

export { isAlphaString, isExcelFile, getFileTypeFromExtension };