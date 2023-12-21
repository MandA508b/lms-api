const {S3Client}  = require("@aws-sdk/client-s3");
const {Upload}   = require("@aws-sdk/lib-storage");
const { SESClient } = require ("@aws-sdk/client-ses");
const { PassThrough } = require('stream');
const fs = require('fs')

const ApiError = require(`../errors/api.error`)

class s3Service{

    async upload(file, name, key){
        try{
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            })

            const bucketName = process.env.AWS_BUCKET_NAME;
            const newFileNameKey= `${key}/${name}`

            const params = {
                Bucket: bucketName,
                Key: newFileNameKey,
                Body: file.buffer,
            };

            return await s3.putObject(params, (err, data) => {
                if (err) {
                    console.log("error: ", err)
                    throw ApiError.internal('Problem with upload file!')
                } else {
                    console.log("success upload: ")
                }
            }).promise()
        }catch (e) {
            console.log("Error: ", e)
        }
    }

    async delete(name, key){
        try{
            const s3 = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            })
            const bucketName = process.env.AWS_BUCKET_NAME;
            const newFileNameKey= `${key}/${name}`

            const params = {
                Bucket: bucketName,
                Key: newFileNameKey
            };

            return await s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log("error: ", err)
                    throw ApiError.internal('Problem with delete file!')
                } else {
                    console.log("success delete: ")
                }
            }).promise()

        }catch (e) {
            console.log("Error: ", e)
        }
    }

}
module.exports = new s3Service()
