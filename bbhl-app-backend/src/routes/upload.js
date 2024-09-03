import Boom from '@hapi/boom';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('Initializing DigitalOcean Spaces configuration...');
console.log('DO_SPACES_REGION:', process.env.DO_SPACES_REGION);
console.log('DO_SPACES_BUCKET:', process.env.DO_SPACES_BUCKET);
console.log('Current working directory:', process.cwd());


const s3Client = new S3Client({
    endpoint: `${process.env.DO_SPACES_ENDPOINT}`,
    region: process.env.DO_SPACES_REGION,
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    },
});

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
            console.log('Request payload:', req.payload);

            const file = req.payload.file;
            if (!file) {
                console.error('No file provided');
                return Boom.badRequest('No file provided');
            }

            const fileName = file.hapi.filename.replace(/\s+/g, '_');
            console.log('File name:', fileName);

            const fileType = file.hapi.headers['content-type'];
            console.log('File type:', fileType);

            // Validate file type
            const validMimeTypes = ['image/png', 'image/jpeg', 'image/x-png', 'image/pjpeg'];
            if (!validMimeTypes.includes(fileType)) {
                console.error('Invalid file type:', fileType);
                return Boom.badRequest('Invalid file type');
            }

            // Validate file size
            console.log('File size:', file._data.length, 'bytes');
            if (file._data.length > 1048576) {
                console.error('File size exceeds 1MB:', file._data.length);
                return Boom.badRequest('File size exceeds 1MB');
            }

            // Prepare the S3 upload parameters
            const putObjectCommand = new PutObjectCommand({
                Bucket: 'bbhl-angular-bucket',
                Key: `player_pics/${fileName}`,
                Body: file._data,
                ACL: 'public-read',
                ContentType: fileType,
            });

            // Upload the file to DigitalOcean Space
            const uploadResult = await s3Client.send(putObjectCommand);

            console.log('File uploaded successfully:', uploadResult);

            const fileUrl = `https://bbhl-angular-bucket.nyc3.digitaloceanspaces.com/player_pics/${fileName}`;
            return h.response({ fileUrl }).code(201);
        
        } catch (error) {
            console.error('Error during file upload:', error);
            return Boom.badImplementation(error.message);
        }
    }
};
