import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        reward: {
            type: String,
            required: true
        },
        notes: {
            type: String,
            required: false
        },
        created: {
            type: Date,
            required: true
        },
        deadline: {
            type: Date,
            required: true
        },
        met: {
            type: Boolean,
            required: true
        },
        isSchool: {
            type: Boolean,
            required: true
        }
    }
)


const Model = mongoose.model("Goal", schema);

export default Model;
