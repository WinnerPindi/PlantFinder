import mongoose from "mongoose";
const { Schema } = mongoose;

const PlantSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required :true,
  },
  family: {
    type: String,
    required : true,
  },
  genus: {
    type: String,
    required: true,
  },
  conservationStatus: {
    type: String,
    enum: ['Least Concern', 'Near Threatened', 'Vulnerable', 'Endangered', 'Critically Endangered', 'Extinct'],
  },
  description: {
    type: String,
    required: true,
  },
  photos: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 5;
      },
      message: 'A plant can have at most 5 photos.',
    },
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
});

PlantSchema.index({ location: '2dsphere' });

export default mongoose.model("Plant", PlantSchema);
