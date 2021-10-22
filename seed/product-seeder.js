var Product = require('../models/product');
var mongoose = require('mongoose');
const { exists } = require('../models/product');
mongoose.connect('mongodb://localhost:27017/shopping',{useNewUrlParser:true,useUnifiedTopology:true})

var products = [
    new Product({
        imagePath:'https://images.unsplash.com/photo-1568639152391-61b4303bead7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=40',
        title: 'Notebook',
        description:'Discount on 3!!!',
        price:'100'

    }),
    new Product({
        imagePath:'https://media.istockphoto.com/photos/hand-sanitizer-bottle-mockup-picture-id1221259449?s=612x612',
        title: 'Hand Sanitizer',
        description:'Discount offer',
        price:'250'

    }),
    new Product({
        imagePath:'https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=40',
        title: 'Bag',
        description:'Discount on 2!!!',
        price:'1500'

    })
];
var done =0;
for (var i =0; i< products.length;i++) {
    products[i].save(function(err,result){
        done++;
        if(done === products.length) {
            exit();
        }
    });
} 
function exit() {
    mongoose.disconnect();
}
