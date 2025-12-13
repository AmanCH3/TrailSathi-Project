const mongoose = require('mongoose');

const verifyReferences = async () => {
    try {
        const uri = "mongodb://localhost:27017/trailsathi";
        console.log(`Connecting to ${uri}...`);
        await mongoose.connect(uri);
        console.log('DB Connected');

        // Access collections directly to avoid schema validation issues
        const soloHikesCol = mongoose.connection.collection('solohikes');
        const usersCol = mongoose.connection.collection('users');
        const trailsCol = mongoose.connection.collection('trails');

        const soloHikes = await soloHikesCol.find({}).toArray();
        console.log(`Analyzing ${soloHikes.length} SoloHike records...`);

        if (soloHikes.length === 0) {
            console.log("No SoloHikes to check.");
            return;
        }

        for (const hike of soloHikes) {
            console.log(`\nChecking Hike ID: ${hike._id}`);
            
            // Check User
            const user = await usersCol.findOne({ _id: hike.user });
            if (user) {
                console.log(`✅ User Reference Valid: ${user.name} (${hike.user})`);
            } else {
                console.log(`❌ User Reference BROKEN: ID ${hike.user} not found in 'users' collection.`);
            }

            // Check Trail
            const trail = await trailsCol.findOne({ _id: hike.trail });
            if (trail) {
                 console.log(`✅ Trail Reference Valid: ${trail.name} (${hike.trail})`);
            } else {
                 console.log(`❌ Trail Reference BROKEN: ID ${hike.trail} not found in 'trails' collection.`);
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

verifyReferences();
