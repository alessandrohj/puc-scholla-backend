import mongoose from "mongoose";

const schema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        deadline: {
            type: Date,
            required: true
        },
        deliveredDate: {
            type: Date,
            required: true
        },
        grade: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        student: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Student',
            required: true,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Class',
            required: true,
        }
    },
    {
        timestamps: true
    }
)

const Model = mongoose.model('Assignment', schema)

export default Model