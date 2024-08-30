import Boom from '@hapi/boom';
import AWS from 'aws-sdk';
import stream from 'stream';
import dotenv from 'dotenv';

dotenv.config();

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
            maxBytes: 1048576, // 1MB limit
            output: 'stream',
            parse: true,
            multipart: true,
            allow: 'multipart/form-data'
        }
    },
    handler: async (req, h) => {
        try {
            const file = req.payload.file;
            if (!file) {
                return Boom.badRequest('No file provided');
            }

            const fileName = file.hapi.filename.replace(/\s+/g, '_');
            const fileType = file.hapi.headers['content-type'];

            // Validate file type
            const validMimeTypes = ['image/png', 'image/jpeg', 'image/x-png', 'image/pjpeg'];
            if (!validMimeTypes.includes(fileType)) {
                return Boom.badRequest('Invalid file type');
            }

            // Validate file size
            if (file._data.length > 1048576) {
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

            // Upload the file to DigitalOcean Space
            const uploadResult = await s3.upload(params).promise();

            return h.response({ fileUrl: uploadResult.Location }).code(201);
        
        } catch (error) {
            return Boom.badImplementation(error.message);
        }
    }
};
