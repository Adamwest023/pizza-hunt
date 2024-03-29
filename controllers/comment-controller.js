const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  addReply({param,body}, res) {
   Comment.findOneAndUpdate(
     {_id: params.commentId},
     //passes the replies body params
     {$push: {replies: body} },
     {new:true, runValidators:true}
     )
     .then(dbPizzaData => {
       if(!dbPizzaData){
         res.status(404).json({ message: 'No pizza found with this id!'})
         return;
       }
       res.json(dbPizzaData);
     })
     .catch(err => res.json(err));
  },

  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  removeReply({ params} , res) {
    Comment.findOneAndUpdate(
      {_id: params.commentId},
      //Here, we're using the MongoDB $pull operator to remove the specific reply from the replies array 
      //where the replyId matches the value of params.replyId passed in from the route. 
      {$pull: {replies: {replyid: params.replyId}}},
      {new:true}
    )
    .then(dbPizzaData => res.json(dbPizzaData))
    .catch(err => res.json(err));
  }
};

module.exports = commentController;
