const generateChecklist = (req, res) => {
    try {
        const { experience, duration, weather } = req.query;

        // Base Items (Always needed)
        const essentials = [
            { id: 1, text: 'Backpack (appropriate size)', checked: false },
            { id: 2, text: 'Water bottle (2L minimum)', checked: false },
            { id: 3, text: 'First-aid kit (blister pads, bandages)', checked: false },
            { id: 4, text: 'Navigation (Map/Compass/GPS)', checked: false },
            { id: 5, text: 'Sun protection (Sunglasses, Sunscreen)', checked: false },
            { id: 6, text: 'Headlamp or Flashlight', checked: false },
            { id: 7, text: 'Multi-tool or Knife', checked: false },
            { id: 8, text: 'Lighter or Matches', checked: false },
        ];

        const clothing = [
            { id: 101, text: 'Moisture-wicking T-shirt', checked: false },
            { id: 102, text: 'Hiking pants/shorts', checked: false },
            { id: 103, text: 'Hiking socks (wool/synthetic)', checked: false },
            { id: 104, text: 'Sturdy hiking boots/shoes', checked: false },
        ];

        const gear = [];

        // Dynamic Logic
        if (weather === 'rainy') {
            clothing.push({ id: 201, text: 'Rain Jacket / Poncho', checked: false });
            clothing.push({ id: 202, text: 'Waterproof pants', checked: false });
            clothing.push({ id: 203, text: 'Pack cover (waterproof)', checked: false });
            gear.push({ id: 301, text: 'Dry bags for electronics', checked: false });
        } else if (weather === 'cold') {
            clothing.push({ id: 204, text: 'Thermal base layers', checked: false });
            clothing.push({ id: 205, text: 'Insulated jacket (Down/Synthetic)', checked: false });
            clothing.push({ id: 206, text: 'Warm hat (Beanie)', checked: false });
            clothing.push({ id: 207, text: 'Gloves', checked: false });
        } else if (weather === 'hot') {
            clothing.push({ id: 208, text: 'Wide-brimmed hat', checked: false });
            essentials.push({ id: 9, text: 'Electrolytes', checked: false });
        }

        if (duration === 'multi-day') {
            gear.push({ id: 302, text: 'Tent / Shelter', checked: false });
            gear.push({ id: 303, text: 'Sleeping bag', checked: false });
            gear.push({ id: 304, text: 'Sleeping pad', checked: false });
            gear.push({ id: 305, text: 'Stove and Fuel', checked: false });
            gear.push({ id: 306, text: 'Cookware', checked: false });
            essentials.push({ id: 10, text: 'Portable Power Bank', checked: false });
        }

        if (experience === 'new') {
            essentials.push({ id: 11, text: 'Printed trail guide', checked: false });
            essentials.push({ id: 12, text: 'Whistle (for emergencies)', checked: false });
        }

        res.status(200).json({
            success: true,
            data: {
                essentials,
                clothing,
                gear
            }
        });

    } catch (error) {
        console.error('Error generating checklist:', error);
        res.status(500).json({ success: false, message: 'Failed to generate checklist' });
    }
};

module.exports = { generateChecklist };
