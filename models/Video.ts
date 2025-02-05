import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSTION = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSTION.height },
      width: { type: Number, default: VIDEO_DIMENSTION.width },
      quality: { type: Number, min: 1, max: 100 },
    },
  },
  { timestamps: true }
);


const Video = models?.Video || model<IVideo>("Video",videoSchema)

export default Video;