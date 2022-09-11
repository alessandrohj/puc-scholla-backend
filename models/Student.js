import mongoose from "mongoose"

const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 254,
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 254,
        },
        email: {
            type: String,
            required: true,
            maxlength: 254,
        },
        parent: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Parent',
            required: true,
        }],
        classes: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Class',
            required: true,
        }],
    },
    {
        timestamps: true
    }
)

const Model = mongoose.model('Student', schema)

export default Model