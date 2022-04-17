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
        DLED:{
            type:Date
        },
        healthCard:{
            data:Buffer,
            contentType:String
        },
        HCED:{
            type:Date
        },
        ontarioId:{
            data:Buffer,
            contentType:String
        },
        OIED:{
            type:Date
        },
        passport:{
            data:Buffer,
            contentType:String
        },
        PED:{
            type:Date
        }
    }
);

mongoose.model('Document', DocumentSchema);