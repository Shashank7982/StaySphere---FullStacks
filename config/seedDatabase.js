const mongoose = require('mongoose');
const connectDB = require('./database');
const Home = require('../models/home');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const sampleListings = [
    // Original 10
    {
        houseName: "Luxury Beachfront Villa",
        price: "450",
        location: "Malibu, California",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
        description: "Wake up to stunning ocean views in this luxurious beachfront villa. Features include infinity pool, private beach access, modern kitchen, and spacious outdoor deck perfect for entertaining.",
        rulesPdf: ""
    },
    {
        houseName: "Cozy Mountain Cabin",
        price: "180",
        location: "Aspen, Colorado",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
        description: "Escape to this charming mountain retreat surrounded by pine trees. Perfect for skiing enthusiasts with fireplace, hot tub, and breathtaking mountain views.",
        rulesPdf: ""
    },
    {
        houseName: "Modern Downtown Loft",
        price: "220",
        location: "New York, NY",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        description: "Stylish industrial loft in the heart of Manhattan. High ceilings, exposed brick, floor-to-ceiling windows, and walking distance to top restaurants and attractions.",
        rulesPdf: ""
    },
    {
        houseName: "Tropical Paradise Bungalow",
        price: "320",
        location: "Bali, Indonesia",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
        description: "Experience paradise in this stunning bungalow surrounded by lush tropical gardens. Private pool, outdoor shower, and traditional Balinese architecture.",
        rulesPdf: ""
    },
    {
        houseName: "Historic Parisian Apartment",
        price: "280",
        location: "Paris, France",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        description: "Charming apartment in the heart of Le Marais. Original hardwood floors, French balcony, and steps away from the best cafes and boutiques in Paris.",
        rulesPdf: ""
    },
    {
        houseName: "Desert Oasis Retreat",
        price: "350",
        location: "Scottsdale, Arizona",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
        description: "Stunning desert contemporary home with panoramic mountain views. Features include saltwater pool, outdoor kitchen, and spectacular sunset views.",
        rulesPdf: ""
    },
    {
        houseName: "Lakeside Cottage",
        price: "195",
        location: "Lake Tahoe, Nevada",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800&h=600&fit=crop",
        description: "Peaceful lakeside cottage with private dock. Perfect for water sports, fishing, and relaxation. Cozy interior with wood-burning stove and lake views.",
        rulesPdf: ""
    },
    {
        houseName: "Urban Penthouse Suite",
        price: "520",
        location: "Miami, Florida",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        description: "Spectacular penthouse with 360-degree city and ocean views. Rooftop terrace, infinity pool, smart home technology, and luxury finishes throughout.",
        rulesPdf: ""
    },
    {
        houseName: "Rustic Farmhouse",
        price: "165",
        location: "Tuscany, Italy",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&h=600&fit=crop",
        description: "Authentic Tuscan farmhouse surrounded by vineyards and olive groves. Stone walls, terracotta floors, and outdoor dining area with countryside views.",
        rulesPdf: ""
    },
    {
        houseName: "Coastal Cliffside Home",
        price: "410",
        location: "Big Sur, California",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
        description: "Architectural masterpiece perched on coastal cliffs. Floor-to-ceiling windows, minimalist design, and unobstructed Pacific Ocean views.",
        rulesPdf: ""
    },
    // 50 More Listings
    {
        houseName: "Alpine Chalet Retreat",
        price: "290",
        location: "Zermatt, Switzerland",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Traditional Swiss chalet with stunning Matterhorn views. Ski-in/ski-out access, sauna, and cozy fireplace.",
        rulesPdf: ""
    },
    {
        houseName: "Beachside Bungalow",
        price: "210",
        location: "Tulum, Mexico",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
        description: "Bohemian beach house steps from white sand beaches. Hammocks, outdoor shower, and tropical garden.",
        rulesPdf: ""
    },
    {
        houseName: "City Center Studio",
        price: "125",
        location: "Barcelona, Spain",
        rating: "4.6",
        photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
        description: "Modern studio in Gothic Quarter. Walking distance to La Rambla, beach, and Gaudi architecture.",
        rulesPdf: ""
    },
    {
        houseName: "Vineyard Estate",
        price: "480",
        location: "Napa Valley, California",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Luxurious estate surrounded by vineyards. Wine cellar, gourmet kitchen, and private tasting room.",
        rulesPdf: ""
    },
    {
        houseName: "Rainforest Treehouse",
        price: "240",
        location: "Costa Rica",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
        description: "Unique treehouse nestled in lush rainforest. Wildlife viewing, zip-line access, and eco-friendly design.",
        rulesPdf: ""
    },
    {
        houseName: "Harbor View Apartment",
        price: "260",
        location: "Sydney, Australia",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Contemporary apartment with Opera House views. Rooftop pool, gym, and walking distance to Circular Quay.",
        rulesPdf: ""
    },
    {
        houseName: "Scottish Castle Suite",
        price: "380",
        location: "Edinburgh, Scotland",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
        description: "Historic castle suite with medieval charm. Four-poster bed, stone fireplace, and panoramic city views.",
        rulesPdf: ""
    },
    {
        houseName: "Island Beach House",
        price: "550",
        location: "Maldives",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
        description: "Overwater villa with direct ocean access. Private infinity pool, glass floor panels, and butler service.",
        rulesPdf: ""
    },
    {
        houseName: "Mountain View Cabin",
        price: "175",
        location: "Banff, Canada",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Rustic cabin with Rocky Mountain views. Hot tub, hiking trails, and wildlife spotting opportunities.",
        rulesPdf: ""
    },
    {
        houseName: "Art Deco Apartment",
        price: "310",
        location: "Miami Beach, Florida",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        description: "Restored 1930s Art Deco gem. Original features, modern amenities, steps to South Beach.",
        rulesPdf: ""
    },
    {
        houseName: "Countryside Manor",
        price: "420",
        location: "Cotswolds, England",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
        description: "Elegant manor house in rolling hills. Formal gardens, library, and afternoon tea service.",
        rulesPdf: ""
    },
    {
        houseName: "Desert Modern Villa",
        price: "395",
        location: "Palm Springs, California",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Mid-century modern masterpiece. Saltwater pool, mountain views, and designer furnishings.",
        rulesPdf: ""
    },
    {
        houseName: "Floating Houseboat",
        price: "185",
        location: "Amsterdam, Netherlands",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Charming houseboat on historic canal. Bike included, central location, unique experience.",
        rulesPdf: ""
    },
    {
        houseName: "Ski Chalet Luxury",
        price: "620",
        location: "Whistler, Canada",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Ultimate ski chalet with slope access. Private chef, hot tub, home theater, and concierge.",
        rulesPdf: ""
    },
    {
        houseName: "Santorini Cave House",
        price: "340",
        location: "Santorini, Greece",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Traditional cave house with caldera views. Infinity pool, sunset terrace, and whitewashed interiors.",
        rulesPdf: ""
    },
    {
        houseName: "Urban Warehouse Loft",
        price: "245",
        location: "Brooklyn, New York",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        description: "Converted warehouse with industrial charm. High ceilings, exposed beams, and rooftop access.",
        rulesPdf: ""
    },
    {
        houseName: "Jungle Villa",
        price: "275",
        location: "Ubud, Bali",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
        description: "Secluded villa in rice terraces. Outdoor bath, yoga deck, and traditional Balinese breakfast.",
        rulesPdf: ""
    },
    {
        houseName: "Lighthouse Keeper's Cottage",
        price: "205",
        location: "Maine, USA",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Historic lighthouse cottage on rocky coast. Ocean views, whale watching, and maritime charm.",
        rulesPdf: ""
    },
    {
        houseName: "Tokyo Minimalist Studio",
        price: "155",
        location: "Tokyo, Japan",
        rating: "4.6",
        photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop",
        description: "Sleek studio in Shibuya. Smart home features, city views, and near subway station.",
        rulesPdf: ""
    },
    {
        houseName: "Provencal Villa",
        price: "365",
        location: "Provence, France",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Lavender fields surround this charming villa. Pool, outdoor kitchen, and French countryside views.",
        rulesPdf: ""
    },
    {
        houseName: "Cliffside Retreat",
        price: "445",
        location: "Amalfi Coast, Italy",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Dramatic cliffside villa overlooking Mediterranean. Terraced gardens, infinity pool, and lemon grove.",
        rulesPdf: ""
    },
    {
        houseName: "Safari Lodge Tent",
        price: "380",
        location: "Serengeti, Tanzania",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=800&h=600&fit=crop",
        description: "Luxury safari tent with wildlife views. En-suite bathroom, private deck, and guided tours included.",
        rulesPdf: ""
    },
    {
        houseName: "Icelandic Glass Igloo",
        price: "425",
        location: "Reykjavik, Iceland",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Glass igloo for Northern Lights viewing. Heated floors, stargazing bed, and geothermal hot tub.",
        rulesPdf: ""
    },
    {
        houseName: "Riverside Cabin",
        price: "160",
        location: "Montana, USA",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Peaceful cabin by rushing river. Fly fishing, hiking trails, and mountain solitude.",
        rulesPdf: ""
    },
    {
        houseName: "Marrakech Riad",
        price: "230",
        location: "Marrakech, Morocco",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Traditional riad with courtyard pool. Moroccan tiles, rooftop terrace, and medina location.",
        rulesPdf: ""
    },
    {
        houseName: "Hamptons Beach House",
        price: "580",
        location: "Hamptons, New York",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&h=600&fit=crop",
        description: "Classic Hamptons estate with private beach. Pool house, tennis court, and chef's kitchen.",
        rulesPdf: ""
    },
    {
        houseName: "Kyoto Traditional Machiya",
        price: "270",
        location: "Kyoto, Japan",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop",
        description: "Restored traditional townhouse. Zen garden, tatami rooms, and walking distance to temples.",
        rulesPdf: ""
    },
    {
        houseName: "Patagonian Lodge",
        price: "315",
        location: "Patagonia, Chile",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Remote lodge with glacier views. Trekking access, local cuisine, and starry night skies.",
        rulesPdf: ""
    },
    {
        houseName: "Dublin Georgian Townhouse",
        price: "255",
        location: "Dublin, Ireland",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Elegant Georgian home in city center. Original features, modern comfort, and Irish hospitality.",
        rulesPdf: ""
    },
    {
        houseName: "Bora Bora Overwater Villa",
        price: "750",
        location: "Bora Bora, French Polynesia",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
        description: "Ultimate luxury overwater bungalow. Glass floor, private lagoon access, and 5-star service.",
        rulesPdf: ""
    },
    {
        houseName: "Vermont Farmhouse",
        price: "190",
        location: "Vermont, USA",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop",
        description: "Charming farmhouse with mountain views. Maple syrup tours, hiking trails, and farm-to-table dining.",
        rulesPdf: ""
    },
    {
        houseName: "Singapore Sky Suite",
        price: "335",
        location: "Singapore",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop",
        description: "High-rise suite with Marina Bay views. Infinity pool, smart home, and rooftop garden.",
        rulesPdf: ""
    },
    {
        houseName: "Croatian Seaside Villa",
        price: "295",
        location: "Dubrovnik, Croatia",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Stone villa overlooking Adriatic Sea. Private beach, outdoor dining, and old town views.",
        rulesPdf: ""
    },
    {
        houseName: "Austin Music District Loft",
        price: "215",
        location: "Austin, Texas",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        description: "Hip loft in live music capital. Walking distance to venues, food trucks, and nightlife.",
        rulesPdf: ""
    },
    {
        houseName: "Norwegian Fjord Cabin",
        price: "265",
        location: "Bergen, Norway",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Waterfront cabin on pristine fjord. Kayaking, Northern Lights, and Scandinavian design.",
        rulesPdf: ""
    },
    {
        houseName: "Buenos Aires Tango Apartment",
        price: "145",
        location: "Buenos Aires, Argentina",
        rating: "4.6",
        photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
        description: "Stylish apartment in Palermo. Tango lessons nearby, rooftop terrace, and local markets.",
        rulesPdf: ""
    },
    {
        houseName: "Seychelles Beach Villa",
        price: "495",
        location: "Seychelles",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
        description: "Exclusive villa on powder-white beach. Private chef, snorkeling, and tropical paradise.",
        rulesPdf: ""
    },
    {
        houseName: "Portland Tiny House",
        price: "95",
        location: "Portland, Oregon",
        rating: "4.5",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Eco-friendly tiny house in urban setting. Minimalist design, bike-friendly, and sustainable living.",
        rulesPdf: ""
    },
    {
        houseName: "Prague Castle View Apartment",
        price: "225",
        location: "Prague, Czech Republic",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
        description: "Historic apartment with castle views. Original architecture, modern amenities, and old town location.",
        rulesPdf: ""
    },
    {
        houseName: "Queenstown Adventure Lodge",
        price: "285",
        location: "Queenstown, New Zealand",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Adventure base with lake views. Near skiing, bungee jumping, and outdoor activities.",
        rulesPdf: ""
    },
    {
        houseName: "Istanbul Bosphorus Mansion",
        price: "405",
        location: "Istanbul, Turkey",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Ottoman-era mansion on Bosphorus. Waterfront terrace, Turkish bath, and historic charm.",
        rulesPdf: ""
    },
    {
        houseName: "Yellowstone Park Cabin",
        price: "235",
        location: "Wyoming, USA",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Rustic cabin near park entrance. Wildlife viewing, geysers nearby, and mountain tranquility.",
        rulesPdf: ""
    },
    {
        houseName: "Copenhagen Canal House",
        price: "305",
        location: "Copenhagen, Denmark",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
        description: "Colorful canal house in Nyhavn. Danish design, waterfront views, and bike culture.",
        rulesPdf: ""
    },
    {
        houseName: "Fiji Island Bungalow",
        price: "385",
        location: "Fiji",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=600&fit=crop",
        description: "Private island bungalow with coral reef. Snorkeling, traditional Fijian meals, and paradise setting.",
        rulesPdf: ""
    },
    {
        houseName: "Nashville Music Row Studio",
        price: "175",
        location: "Nashville, Tennessee",
        rating: "4.7",
        photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        description: "Stylish studio near honky-tonks. Music history, Southern cuisine, and live entertainment.",
        rulesPdf: ""
    },
    {
        houseName: "Scottish Highlands Castle",
        price: "650",
        location: "Highlands, Scotland",
        rating: "5.0",
        photo: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
        description: "Entire castle in dramatic highlands. Historic grandeur, whisky tours, and Scottish heritage.",
        rulesPdf: ""
    },
    {
        houseName: "Rio Beachfront Penthouse",
        price: "355",
        location: "Rio de Janeiro, Brazil",
        rating: "4.9",
        photo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
        description: "Copacabana penthouse with ocean views. Rooftop pool, samba culture, and beach lifestyle.",
        rulesPdf: ""
    },
    {
        houseName: "Alaskan Wilderness Lodge",
        price: "325",
        location: "Alaska, USA",
        rating: "4.8",
        photo: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        description: "Remote lodge accessible by seaplane. Bear viewing, salmon fishing, and untouched wilderness.",
        rulesPdf: ""
    }
];

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await Home.deleteMany({});
        await User.deleteMany({});

        console.log('🏠 Creating 60 sample listings...');
        const homes = await Home.insertMany(sampleListings);
        console.log(`✅ Created ${homes.length} listings`);

        console.log('👤 Creating sample users...');
        const hashedPassword = await bcrypt.hash('password123', 12);

        const users = await User.insertMany([
            {
                firstName: 'John',
                lastName: 'Doe',
                email: 'guest@example.com',
                password: hashedPassword,
                userType: 'guest',
                favourites: []
            },
            {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'host@example.com',
                password: hashedPassword,
                userType: 'host',
                favourites: []
            }
        ]);
        console.log(`✅ Created ${users.length} users`);

        console.log('\n✨ Database seeded successfully with 60 properties!');
        console.log('\n📝 Sample login credentials:');
        console.log('   Guest: guest@example.com / password123');
        console.log('   Host: host@example.com / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
