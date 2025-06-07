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

export { getFileTypeFromExtension };