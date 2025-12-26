const mongoose = require('mongoose')
const validator = require("validator")
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"]
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, "Please provide a valid email"]
        },
        password: {
            type: String,
            required: [true, "Please provide your password"],
            minlength: 8,
            select: false
        },
        phone: {
            type: String,
            required: [true, "Please provide a phone number"]
        },
        hikerType: {
            type: String,
            enum: ["new", "experienced"],
            default: "new"
        },
        ageGroup: {
            type: String,
            enum: ["18-24", "24-35", "35-44", "45-54", "55-64", "65+"],
        },
        emergencyContact: {
            name: { type: String },
            phone: { type: String },
        },
        bio: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: ""
        },
        joinDate: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ["user", "guide", "admin"],
            default: "user"
        },
        subscription: {
            type: String,
            enum: ["Basic", "Pro", "Premium"],
            default: "Basic"
        },
        subscriptionExpiresAt: {
            type: Date,
            default: null
        },
        active: {
            type: Boolean,
            default: true,
            select: false
        },
        stats: {
            totalHikes: { type: Number, default: 0 },
            totalDistance: { type: Number, default: 0 },
            totalElevation: { type: Number, default: 0 },
            totalHours: { type: Number, default: 0 },
            hikesJoined: { type: Number, default: 0 }, 
            hikesLed: { type: Number, default: 0 }
        },
        unlockedAchievements: {
             type: [String],
             default: []
        },
        achievements: [{
            type: mongoose.Schema.ObjectId,
            ref: "Achievement",
        }],
        completedTrails: [{
            trail: {
                type: mongoose.Schema.ObjectId,
                ref: "Trail"
            },
            completedAt: {
                type: Date,
                default: Date.now
            }
        }],
        joinedTrails: [{
            trail: {
                type: mongoose.Schema.ObjectId,
                ref: "Trail",
                required: true
            },
            scheduledDate: {
                type: Date,
                required: true
            },
            addedAt: {
                type: Date,
                default: Date.now
            },
        }],
        passwordResetOTP: String,
        passwordResetExpires: Date
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Password hashing middleware (if not already present)
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);