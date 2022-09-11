import mongoose from "mongoose"

const schema = mongoose.model('User').findOne({role: 'student'})
const studentSchema = new schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User', 
            required: true,
        },
        studentId: {
            type: Number,
            required: false
        },
        sharedWith: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Parent',
            required: true,
        }],
        classes: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Class',
            required: true,
        }],
    },
)

const Model = mongoose.model('Student', studentSchema)

export default Model