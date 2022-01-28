const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Restaurant = require('../models/restaurant');


mongoose.connect('mongodb://localhost:27017/eatsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => { 
    await Restaurant.deleteMany({});
    for(let i=0; i< 50; i++){
        const random1000 = Math.floor(Math.random() *1000);
        //const number = Math.floor(Math.random() *1000000000);
        const resta = new Restaurant({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/1028299',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et vero tempora eligendi praesentium ad assumenda reiciendis ex error nihil, quam ipsam mollitia totam, nobis vel libero accusantium quia at provident.',
           })
        await resta.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})