import Boom from '@hapi/boom';
import fs from 'fs';
import path from 'path';

const uploadDirectory = path.join(process.cwd(), 'bbhl-app/src/assets/player_pics');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

export const uploadFileRoute = {
    method: 'POST',
    path: '/api/admin-hub/upload',
    options: {
        payload: {
            maxBytes: 1048576,
            output: 'stream',
            parse: false,
            allow: 'multipart/form-data'
        }
    },
    handler: async (req, h) => {
        try {
            const file = req.payload.file;
            if (!file) {
                return Boom.badRequest('No file provided');
            }

            console.log('Headers:', req.headers);
            console.log('Payload:', req.payload);

            const fileName = file.hapi.filename.replace(/\s+/g, '_');
            console.log('Detected file name:', fileName);

            const fileType = file.hapi.headers['content-type'];
            console.log('Detected file type:', fileType);


            // Validate file type
            const validMimeTypes = ['image/png', 'image/jpeg', 'image/x-png', 'image/pjpeg'];
            if (!validMimeTypes.includes(fileType)) {
                return Boom.badRequest('Invalid file type');
            }

            // Validate file size
            if (file._data.length > 1048576) { // 1MB
                return Boom.badRequest('File size exceeds 1MB');
            }

            const filePath = path.join(uploadDirectory, fileName);

            // Save file
            await new Promise((resolve, reject) => {
                const fileStream = fs.createWriteStream(filePath);
                fileStream.on('error', reject);
                fileStream.on('finish', resolve);
                file.pipe(fileStream);
            });

            const fileUrl = `/assets/player_pics/${fileName}`;
            return h.response({ fileUrl }).code(201);
        
        } catch (error) {
            return Boom.badImplementation(error.message);
        }
    }
};
