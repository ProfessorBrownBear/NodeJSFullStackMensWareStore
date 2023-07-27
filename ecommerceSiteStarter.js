

The complete code for the project. Note that in a real-world scenario, you would likely break this down into multiple files (such as splitting out your routes or your Mongoose model into separate modules).
 This is a very basic full-stack application that includes an Express server with MongoDB integration and a simple HTML page with jQuery. It is capable of creating and listing products. Note that the server and client are served from the same domain, but in a real-world scenario, you would probably serve them from different domains, with the server exposing a RESTful API.
 

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/mensware', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Mongoose schema for Men's Ware products
const productSchema = new mongoose.Schema({
    name: String,
    price: Number
});

// Create Mongoose model
const Product = mongoose.model('Product', productSchema);

// Initialize Express
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a new product
app.post('/products', (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    newProduct.save((err, product) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(product);
    });
});

// Get all products
app.get('/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(products);
    });
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// Insert 20 initial products
for (let i = 1; i <= 20; i++) {
    const product = new Product({
        name: `Product ${i}`,
        price: i * 10
    });
    product.save();
}


<!DOCTYPE html>
<html>
<head>
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <script>
    $(document).ready(function() {
        // On form submission
        $('#product-form').submit(function(e) {
            e.preventDefault();
            // Create new product
            $.ajax({
                url: '/products',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: $('#name').val(),
                    price: $('#price').val()
                }),
                success: function(response) {
                    // Append new product to list
                    $('#product-list').append(`<li>${response.name} - $${response.price}</li>`);
                }
            });
        });

        // Get all products
        $.ajax({
            url: '/products',
            method: 'GET',
            success: function(response) {
                // Append each product to list
                response.forEach(product => {
                    $('#product-list').append(`<li>${product.name} - $${product.price}</li>`);
                });
            }
        });
    });
    </script>
</head>
<body>
    <form id="product-form">
        <input type="text" id="name" placeholder="Product name" required>
        <input type="number" id="price" placeholder="Product price" required>
        <input type="submit" value="Create Product">
    </form>
    <ul id="product-list"></ul>
</body>
</html>
