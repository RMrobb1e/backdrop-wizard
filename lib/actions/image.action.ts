"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import User from "../database/models/user.model";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

const populateUser = (query: any) =>
  query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName",
  });

// Add Image
export const addImage = async ({ image, userId, path }: AddImageParams) => {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
};

// Update Image
export const updateImage = async ({
  image,
  userId,
  path,
}: UpdateImageParams) => {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate) {
      throw new Error("Image not found");
    }

    if (imageToUpdate.author.toHexString() !== userId) {
      throw new Error("You are not allowed to update this image");
    }

    const updatedImage = await Image.findByIdAndUpdate(image._id, image, {
      new: true,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
};

// Delete Image
export const deleteImage = async (imageId: string) => {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);

    return JSON.parse(JSON.stringify({ message: "Image deleted" }));
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
};

// Get Image by Id
export const getImageById = async (imageId: string) => {
  try {
    await connectToDatabase();
    const image = await populateUser(Image.findById(imageId));

    if (!image) {
      throw new Error("Image not found");
    }

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
};
