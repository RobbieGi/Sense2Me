const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const crypto = require("crypto")
const cors = require('cors');
const session = require('express-session')   

const mongoDB = 'mongodb+srv://Scodia619:VQZgZoaEI7CGEM6u@sense2me.hu2nwde.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

// const autoIncrement = require('mongoose-auto-increment');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// userSchema.plugin(autoIncrement.plugin, { model: 'User', field: '_id' });
// productSchema.plugin(autoIncrement.plugin, { model: 'Product', field: '_id' });

const Products = require('./sense2me/models/Products')
const Users = require('./sense2me/models/User')
const Orders = require('./sense2me/models/Orders')

const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

const port = 4567

//All GET requests
//All GET requests
//All GET requests
//All GET requests
//All GET requests
//All GET requests
//All GET requests
//All GET requests

//getting all the products
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

//getting all the users in the database
app.get("/user", (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    
    Users.find((err, users) => {
        if (err) return next(err);
            res.json(users);
        console.log("Users: ", users[0].name)
    })
})

// Assuming you are using Express.js
app.get('/getUsername', (req, res) => {
  const username = req.session.username; // Retrieve the username from the session variable

  // Check if the username is available in the session
  if (username) {
    res.json({ username }); // Return the username as a JSON response
  } else {
    res.status(401).json({ message: 'User not logged in' }); // Return an appropriate error message if the user is not logged in
  }
});

app.get('/product', (req, res) => {
  Products.find((err, products) => {
    if (err) return next(err);
        res.json(products);
    console.log("Products: ", products[0].name)
  })
})


//All Post Requests
//All Post Requests
//All Post Requests
//All Post Requests
//All Post Requests
//All Post Requests
//All Post Requests
//All Post Requests

//creating a product
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

//creating a user
app.post("/createUser", (req, res) => {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    
    const name = req.body.name;
    const email = req.body.email;

    Users.findOne({ $or: [{ name: name }, { email: email }] }, (err, user) => {
      if (err) {
        // Handle the error
        return res.status(500).json({ error: err.message });
      }
    
      if (user) {
        // If a user with the same name or email already exists, send an error response
        return res.status(409).json({ message: 'A user with this name or email already exists' });
      }

    console.log(req.body);
    Users.create(req.body, (err, user) => {
        if (err) return next(err);
        res.json(user);
      });
})})

//Logging in a user
app.post('/login', (req, res) => {

    //headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    const { name, password } = req.body;

    // find user in database
    Users.findOne({ name })
      .then(user => {
        if (!user) {
          // user not found
          return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        // hash password with salt
        const passwordWithSalt = password + user.salt
        const hashedPassword = crypto.createHash('sha256').update(passwordWithSalt).digest('hex');
  
        // compare hashed password with stored password
        if (hashedPassword !== user.password) {
          // password incorrect
          console.log(user.salt, hashedPassword)
          return res.status(401).json({ message: 'Invalid username or password' });
        }
  
        // login successful
        req.session.username = name;
        console.log(req.session)
        console.log("This is the login pages" + req.session.username)
        return res.status(200).json({ isAdmin: user.isAdmin });
      })
      .catch(error => {
        console.error('Error finding user in database:', error);
        return res.status(500).json({ message: 'Internal server error' });
      });
  });

  app.post('/order', (req, res) => {
    const { date, price, items, user, orderCode, address } = req.body;
  
    const newOrder = new Orders({
      date,
      price,
      items,
      user,
      dispatched: false,
      orderCode,
      address,
    });
  
    newOrder.save((err, order) => {
      if (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Failed to create order' });
      }
      res.json(order);
    });
  });
  
//ALL UPDATE REQUESTS
//ALL UPDATE REQUESTS
//ALL UPDATE REQUESTS
//ALL UPDATE REQUESTS
//ALL UPDATE REQUESTS

app.put('/product/:name', (req, res) => {
  const productName = req.params.name;
  const updatedProduct = req.body;

  console.log(updatedProduct)

  Products.findOneAndUpdate({name: productName}, updatedProduct, {new: true})
  .then(updatedProduct => {
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  })
  .catch(error => {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal server error' });
  })
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