import Boom from '@hapi/boom';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing DigitalOcean Spaces configuration...');
console.log('DO_SPACES_REGION:', process.env.DO_SPACES_REGION);
console.log('DO_SPACES_BUCKET:', process.env.DO_SPACES_BUCKET);

const spacesEndpoint = new AWS.Endpoint(`${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
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
            const params = {
                Bucket: process.env.DO_SPACES_BUCKET,
                Key: `player_pics/${fileName}`, 
                Body: file,
                ACL: 'public-read', 
                ContentType: fileType,
            };

            console.log('Uploading file to DigitalOcean Space with parameters:', params);

            // Upload the file to DigitalOcean Space
            const uploadResult = await s3.upload(params).promise();

            console.log('File uploaded successfully:', uploadResult);

            return h.response({ fileUrl: uploadResult.Location }).code(201);
        
        } catch (error) {
            console.error('Error during file upload:', error);
            return Boom.badImplementation(error.message);
        }
    }
};
