import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //algo
  //get user details from frontend
  //validation not empty
  //check if user already exist by-username,email
  //check for images, check for avatar
  //upload them to cloudinary,avatar
  //create user object create entry in db
  //remove password and refresh token field from response
  //checkvfor user creation
  //return response

  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, password, username].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Checking if user already exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // check for avatar
  // FIXinggggg: Added '?' after 'avatar' to prevent crash if 'avatar' is not sent
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // uploading avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed. Please try again.");
  }

  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImage = null;
  if (coverImageLocalPath) {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  }

  //  Creating user object in db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  //user created (without password/token)
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  //returning responses
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
