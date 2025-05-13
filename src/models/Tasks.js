const {Schema, model}= require("mongoose");

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["pendiente", "en proceso", "completada"],
    },
    deadline: {
        type: Date,
        required: false
    },
},
    {
    timestamps: true,
    versionKey: false
}
);

module.exports = model("Task", taskSchema);