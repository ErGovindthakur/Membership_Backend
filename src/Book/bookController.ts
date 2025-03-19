import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  // when data comes through forms
  //   console.log("files", req.files);

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImgMimeType = files.coverImg[0].mimetype.split("/").at(-1);

    const fileName = files.coverImg[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "Book Covers",
      format: coverImgMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "Book Content",
        format: "pdf",
      }
    );
    console.log(uploadResult);
    console.log(bookFileUploadResult);

    // creating new book
    const newBook = await bookModel.create({
      title,
      genre,
      author: "67d52511d091850a35a65201",
      coverImg: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // Delete temp files
    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res
      .status(201)
      .json({ message: "Book created successfully", id: newBook._id });

  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Failed to upload file"));
  }
};

export { createBook };
