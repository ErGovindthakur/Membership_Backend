import { Request, Response, NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import fs from "node:fs";
import { AuthRequest } from "../middleware/authenticate";

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
    /*
    console.log(uploadResult);
    console.log(bookFileUploadResult);
    */

    const _req = req as AuthRequest;

    // creating new book
    const newBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
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

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const { bookId } = req.params;
  try {
    // code
    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // Access checking
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized user:can't update book"));
    }

    // check if file already exists
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let completeCoverImg = "";
    if (files.coverImg) {
      const fileName = files.coverImg[0].filename;

      const coverImgMimeType = files.coverImg[0].mimetype.split("/").at(-1);

      // send files to cloudinary
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );

      completeCoverImg = fileName;
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: completeCoverImg,
        folder: "Book Covers",
        format: coverImgMimeType,
      });

      completeCoverImg = uploadResult.secure_url;
      await fs.promises.unlink(filePath);
    }

    // check if file field exists

    let completeFileName = "";

    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      completeFileName = bookFileName;
      const bookFileUploadResult = await cloudinary.uploader.upload(
        bookFilePath,
        {
          resource_type: "raw",
          filename_override: completeFileName,
          folder: "Book Content",
          format: "pdf",
        }
      );
      completeFileName = bookFileUploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updateBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        genre: genre,
        coverImg: completeCoverImg ? completeCoverImg : book.coverImg,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );
    res.json(updateBook);
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Failed to update book"));
  }
};

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // code

    // Add pagination
    const books = await bookModel.find();

    res.status(200).json({
      message: "These are the books",
      books,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Failed to fetch all books"));
  }
};

const getSingleBook = async(req:Request,res:Response,next:NextFunction) => {
  const {bookId} = req.params;
  try{
    // code
    const book = await bookModel.findById({_id:bookId});

    if(!book){
      return next(createHttpError(404,"Book not found "))
    }

    res.status(200).json({
      book
    })

  }catch(error){
    console.log(error);
    return next(createHttpError(500,"Failed to fetch single book"))
  }
}

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const {bookId} = req.params;
  try{
    // code
    const book = await bookModel.findOne({_id:bookId});

    if(!book){
      return next(createHttpError(404,"Book not found "))
    }

    // Access checking
    const _req = req as AuthRequest;
    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "Unauthorized user:can't delete book"));
    }


    const coverFileSplits = book.coverImg.split("/")
    
    const coverImgPublicId = coverFileSplits.at(-2)+'/'+(coverFileSplits.at(-1)?.split('.').at(-2));
    console.log(coverImgPublicId);

    const bookFileSpits = book.file.split('/');
    const bookFilePublicId = bookFileSpits.at(-2)+"/"+bookFileSpits.at(-1);
    console.log(bookFilePublicId);
    // deleting cloudinary file
    await cloudinary.uploader.destroy(coverImgPublicId)
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type:'raw'
    })

    await bookModel.deleteOne({_id:bookId});

    res.status(204).json({
      message:"Book deleted now...",
      BookId:bookId
    })
  }
  catch(error){
    console.log(error);
    return next(createHttpError(500,"Failed to delete book"));
  }
}
export { createBook, updateBook, getAllBooks,getSingleBook,deleteBook };
