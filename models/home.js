// EXTERNAL MODULES
const mongoose=require('mongoose');
// LOCAL MODULES
const Favourite=require('./favourites');


// id automatically added by mongoose
const homeSchema=mongoose.Schema({
  houseName:{type:String,required:true},
  price:{type:String,required:true},
  location:{type:String,required:true},
  rating:{type:String,required:true},
  photo:String,
  description:String,
  rulesPdf:String
});

module.exports=mongoose.model("Home",homeSchema);