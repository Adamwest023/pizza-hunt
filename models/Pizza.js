const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema({
    pizzaName: {
        type:String,
        required:true,
        trim:true
    },
    createdBy: {
        type:String,
        required:true,
        trim: true
    },
    createdAt: {
        type:Date,
        default:Date.now,
        get:(createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
        type:String,
        required:true,
        enum:['Personal', 'Small','Medium','Large','Extra Large'],
        default:'Large'
    },
    toppings: [],
    comments: [
        {
            type:Schema.Types.ObjectId,
            ref:'Comment'
        }
    ]
},
//tells our Schema it can use virtuals
{
    toJSON: {
        virtuals: true,
        getters: true
      },
    //this is a virtual that Mongoose returns, and we don't need it 
    id: false
}
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function(){
    //now includes all comments and replies 
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);


// export the Pizza model
module.exports = Pizza;