const mongoose = require('mongoose');

const checkExplicitDB = async () => {
  try {
    // Hardcoded to match User's Screenshot
    const uri = "mongodb://localhost:27017/trailsathi"; 
    console.log(`Connecting to ${uri}...`);
    await mongoose.connect(uri);
    console.log('DB Connected');

    // Define minimal schemas to avoid model compilation errors if files are missing
    const userSchema = new mongoose.Schema({ name: String, email: String }, { strict: false });
    const User = mongoose.model('User', userSchema);
    
    // Check Solohikes collection directly
    const collection = mongoose.connection.collection('solohikes');
    const hikes = await collection.find({}).toArray();

    console.log(`Found ${hikes.length} documents in 'solohikes' collection.`);
    
    if (hikes.length > 0) {
        console.log("Sample Hike:", JSON.stringify(hikes[0], null, 2));
        
        // Check if the user exists
        const userId = hikes[0].user;
        console.log(`Checking existence of User ID: ${userId}`);
        const user = await User.findById(userId);
        if (user) {
            console.log(`User found: ${user.name} (${user.email})`);
        } else {
            console.log("⚠️ User referenced in Hike NOT found in Users collection!");
        }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

checkExplicitDB();
