/* Requiring Module you have install it using npm */
const mongoose = require('mongoose');

/* Connecting to mongodb using mongoose {Copy path from mongodb} */
mongoose.connect('mongodb://localhost:27017/fruitsDB',{useNewUrlParser:true});

/* Creating fruit Schema */
const fruitschema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Invalid Entry!! No Name specified"]
    },
    rating:{
        type:Number,
        min:1,//By setting we ensure that rating will be greater than or equal to 1
        max:10//By setting we ensure that rating will be less than or equal to 1
    },
    review:String
});

/* This line will enable us to use our fruitschema && wiil database of name fruit{whihich is double quotes} */
const Fruit=mongoose.model("fruit",fruitschema);

/* Creating our data */
const apple=new Fruit({
    name:"Apple",
    rating:4,
    review:"Good"
});

/* Saving our data */
apple.save();

const banana=new Fruit({
    name:"Banana",
    rating:4,
    review:"Fav fruit"
});

// banana.save();

const orange=new Fruit({
    name:"orange",
    rating:8,
    review:"Ok!!"
});

// orange.save();

// Fruit.insertMany([apple,banana,orange]);//Note : InsertMany is not now accepting callback function



/* Reading data from database */
Fruit.find({}) 
  .then((fruits) => {
    // Success callback

    for(var i=0;i<fruits.length;i++)
    {
        console.log(fruits[i].name);
    }
  })
  .catch((error) => {
    // Error callback
    console.error(error);
  });

  // async function readData() {
  //   try {
  //     // Retrieve all documents from the "Person" collection
  //     const people = await Person.find();
  
  //     // Process the retrieved data
  //     console.log(people);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     // Disconnect from MongoDB
  //     mongoose.disconnect();
  //   }
  // }
  

  /* How to update particular data */

//   Fruit.updateOne({ name:"Apple" }, { name:"Anar" })
//   .then((result) => {
//     console.log('Update successful:');
//   })
//   .catch((error) => {
//     console.error('Error updating document:');
//   });

/* How to delete particular data */

Fruit.deleteOne({ name:"Anar" })
  .then((result) => {
    console.log('Deletion successful:');
  })
  .catch((error) => {
    console.error('Error deleting document:');
  });

//   mongoose.connection.close();