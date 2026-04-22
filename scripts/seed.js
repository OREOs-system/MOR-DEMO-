const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const connectDB = require('./config/db');

// Menu data from data.js
const shopItemsData = [
    {
      id: "americano12oz",
      name: "Americano",
      price: 55,
      desc: "A strong black coffee made with espresso and hot water.",
      img: "americano.jpg",
    },
    {
      id: "spanishLatte12oz",
      name: "Spanish Latte",
      price: 65,
      desc: "A rich espresso combined with steamed milk and a hint of caramel.",
      img: "spanish latte.jpg",
    },
    {
      id: "matchaEspresso12oz",
      name: "Matcha Espresso",
      price: 60,
      desc: "A blend of matcha and espresso with steamed milk.",
      img: "matcha espresso.jpg",
    },
    {
      id: "caramelMacchiato12oz",
      name: "Caramel Macchiato",
      price: 65,
      desc: "Espresso combined with steamed milk and topped with caramel syrup.",
      img: "iced caramel macchiato.jpg",
    },
    {
      id: "hazelnutMacchiato12oz",
      name: "Hazelnut Macchiato",
      price: 65,
      desc: "A sweet espresso with steamed milk and a hint of hazelnut flavor.",
      img: "hazelnut_macchiato.jpg",
    },
    {
      id: "almondLatte12oz",
      name: "Almond Latte",
      price: 60,
      desc: "A smooth blend of espresso, steamed milk, and almond flavor.",
      img: "almondl.jpg",
    },
    {
      id: "butterscotchLatte12oz",
      name: "Butterscotch Latte",
      price: 60,
      desc: "A delicious blend of espresso, steamed milk, and butterscotch syrup.",
      img: "butterscotch_latte.jpg",
    },
    {
      id: "mochaLatte12oz",
      name: "Mocha Latte",
      price: 60,
      desc: "A rich espresso mixed with steamed milk and chocolate syrup.",
      img: "mocha_latte.jpg",
    },
    {
      id: "javaChip16oz",
      name: "Java Chip",
      price: 89,
      desc: "A chocolatey frappe made with coffee, chocolate chips, and ice.",
      img: "javaF.jpg",
    },
    {
      id: "butterscotch16oz",
      name: "Butterscotch",
      price: 79,
      desc: "A smooth frappe with butterscotch flavor and ice.",
      img: "butterscotch.jpg",
    },
    {
      id: "almondFrappe16oz",
      name: "Almond Frappe",
      price: 79,
      desc: "A chilled frappe blended with almond flavor and ice.",
      img: "almondf.jpg",
    },
    {
      id: "hazelnutFrappe16oz",
      name: "Hazelnut Frappe",
      price: 79,
      desc: "A rich frappe with hazelnut flavor and ice.",
      img: "hazelnutf.jpg",
    },
    {
      id: "matchaFrappe16oz",
      name: "Matcha Frappe",
      price: 79,
      desc: "A refreshing frappe with matcha flavor and ice.",
      img: "matcha_frappe.jpg",
    },
    {
      id: "darkMochaFrappe16oz",
      name: "Dark Mocha Frappe",
      price: 79,
      desc: "A decadent dark chocolate frappe with ice.",
      img: "fpp.jpg",
    },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(shopItemsData);
    console.log(`Successfully seeded ${insertedProducts.length} products`);

    mongoose.connection.close();
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
