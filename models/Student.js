import mongoose from "mongoose"

const schema = new mongoose.Schema(
    {
        parent: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Parent',
            required: true,
        }],
        classes: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Class',
            required: true,
        }],
    },
)

const Model = mongoose.model('Student', schema)

export default Model