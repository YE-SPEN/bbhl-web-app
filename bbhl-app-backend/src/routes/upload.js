import Boom from '@hapi/boom';
import fs from 'fs';
import path from 'path';

const uploadDirectory = path.join(process.cwd(), 'bbhl-app/src/assets/player_pics');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    console.log('Upload directory created:', uploadDirectory);
} else {
    console.log('Upload directory already exists:', uploadDirectory);
}

export const uploadFileRoute = {
    method: 'POST',
    path: '/api/admin-hub/upload',
    options: {
        payload: {
            maxBytes: 1048576,
            output: 'stream',
            parse: true,
            multipart: true,
            allow: 'multipart/form-data'
        }
    },
    handler: async (req, h) => {
        try {
            console.log('Received POST request at /api/admin-hub/upload');
            console.log('Received payload:', req.payload);
            console.log('Request headers:', req.headers);

            const file = req.payload.file;
            if (!file) {
                console.error('No file provided in the request payload');
                return Boom.badRequest('No file provided');
            }

            console.log('File object received:', file);

            const fileName = file.hapi.filename.replace(/\s+/g, '_');
            console.log('Updated file name:', fileName);

            const fileType = file.hapi.headers['content-type'];
            console.log('Detected file type:', fileType);

            // Validate file type
            const validMimeTypes = ['image/png', 'image/jpeg', 'image/x-png', 'image/pjpeg'];
            if (!validMimeTypes.includes(fileType)) {
                console.error('Invalid file type:', fileType);
                return Boom.badRequest('Invalid file type');
            } else {
                console.log('File type is valid');
            }

            // Validate file size
            console.log('File size:', file._data.length, 'bytes');
            if (file._data.length > 1048576) { // 1MB
                console.error('File size exceeds 1MB:', file._data.length);
                return Boom.badRequest('File size exceeds 1MB');
            } else {
                console.log('File size is within the acceptable limit');
            }

            const filePath = path.join(uploadDirectory, fileName);
            console.log('File will be saved to:', filePath);

            // Save the file
            await new Promise((resolve, reject) => {
                const fileStream = fs.createWriteStream(filePath);
                fileStream.on('error', (err) => {
                    console.error('Error writing file to disk:', err);
                    reject(err);
                });
                fileStream.on('finish', () => {
                    console.log('File successfully written to disk');
                    resolve();
                });
                file.pipe(fileStream);
            });

            const fileUrl = `/assets/player_pics/${fileName}`;
            console.log('File accessible at:', fileUrl);
            return h.response({ fileUrl }).code(201);
        
        } catch (error) {
            console.error('Error during file upload:', error.message);
            return Boom.badImplementation(error.message);
        }
    }
};
