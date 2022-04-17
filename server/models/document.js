let mongoose = require('mongoose');
const Schema = mongoose.Schema;
let DocumentSchema = new Schema(
    {
        user:{
            type:[Schema.ObjectId],
            ref:'User'
        },
        drivingLicence:{
            data:Buffer,
            contentType:String
        },
        healthCard:{
            data:Buffer,
            contentType:String
        },
        ontarioId:{
            data:Buffer,
            contentType:String
        },
        passport:{
            data:Buffer,
            contentType:String
        }
    }
);

mongoose.model('Document', DocumentSchema);