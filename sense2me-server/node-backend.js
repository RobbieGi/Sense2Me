const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")

const mongoDB = 'mongodb+srv://Scodia619:VQZgZoaEI7CGEM6u@sense2me.hu2nwde.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

const autoIncrement = require('mongoose-auto-increment');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

autoIncrement.initialize(mongoose.connection);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, 
    password: { type: String, required: true }, 
    isAdmin: {type: Boolean, required: true}
})

const productSchema = new mongoose.Schema({
    name: String,
    price: String,
    description: String,
    image: String
})

userSchema.plugin(autoIncrement.plugin, { model: 'User', field: '_id' });
productSchema.plugin(autoIncrement.plugin, { model: 'Product', field: '_id' });

const Products = mongoose.model('Product', productSchema)
const Users = mongoose.model('User', userSchema)

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 4567

app.get("/", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    
    Products.find((err, products) => {
        if (err) return next(err);
            res.json(products);
        console.log("Products: ", products)
    })
})

// app.get("/products/:id", (req, res) => {
//     Products.findById(req.params.id, (err, products) => {
//         res.json(products)
//     })
// })

app.post("/", (req, res) => {
    console.log(req.body);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  
    Products.create(req.body, (err, product) => {
      if (err) return next(err);
      res.json(product);
    });
  });

app.post("/user", (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    
    console.log(req.body);
    Users.create(req.body, (err, user) => {
        if (err) return next(err);
        res.json(user);
      });
})


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});
  
// app.put("/dogs/:id", (req, res) => {
//     console.log(req.params.id)
//     console.log(req.body)
//     res.json({message: `updating dog ${req.params.id}`})
// })

// app.delete("/dogs/:id", (req, res) => {
//     console.log(req.params.id)
//     res.json({message: `deleting dog ${req.params.id}`})
// })

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

//CRUD = create, read, update, delete
//HTTP ==> POST, GET, PUT/PATCH, DELETE