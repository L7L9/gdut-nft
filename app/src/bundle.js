var db = new PouchDB('my_database');
db
 .info()
 .then(function (info) {
   console.log(info);
 })
var doc = {
   _id : "002",
   name: "lql",
   age : 19,
   designation : "帅哥"
}

db.createIndex({
   index:{
      fields:['age']
   }
})

//Inserting Document
db.put(doc, function(err, response) {
   if (err) {
      return console.log(err);
   } else {
      console.log("Document created Successfully");
   }
});
db.get("19", function(err, doc) {
  if (err) {
     return console.log(err);
  } else {
     console.log(doc);
  }
});
db.createIndex({
   index: {fields: ['name']}
 }).then(function () {
     db.find({
     selector: {name: "lql"},
     sort: ['name']
   }).then(function(result){
      console.log(result.docs[0].age)
   })
 });