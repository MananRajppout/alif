import { requireAdmin } from "../middleware/authenticate";
import BlogsModel from "../models/blogs.model";
import { uploadImageToCloudinary } from "../utils/cloudinary";

export async function postBlog(
  accessToken: string,
  blogData: any,
  images: any
) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;
    const userId = user._id;

    if (adminRole === false) {
      return "User is not an admin";
    }

    let displayImage;
    if (images.displayImage) {
      const coverImageURL = await uploadImageToCloudinary(images.displayImage);
      displayImage = coverImageURL?.secure_url;
    } else {
      displayImage = null;
    }

    const blogDataInput = {
      ...blogData,
      user: userId,
      displayImage,
    };

    const blog = await BlogsModel.create(blogDataInput);
    return blog;
  } catch (e) {
    throw e;
  }
}

export async function getBlogsPublic() {
  try {
    const blogs = await BlogsModel.find({
      "isActive": true,
    });
    return blogs;
    
  } catch (e) {
    throw e;
  }
}

export async function getBlogsPrivate(accessToken: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === true) {
        const blogs = await BlogsModel.find();
          return blogs;
    }
    return "User is not an admin";
   
  } catch (e) {
    throw e;
  }
}

export async function enableBlog(accessToken: string, blogId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const blog = await BlogsModel.findOne({ _id: blogId });

    if (!blog) {
      return "blog not found";
    }

    blog.isActive = true;

    blog.save();

    return blog;
  } catch (e) {
    throw e;
  }
}

export async function disableBlog(accessToken: string, blogId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const blog = await BlogsModel.findOne({ _id: blogId });

    if (!blog) {
      return "blog not found";
    }

    blog.isActive = false;


    blog.save();

    return blog;
  } catch (e) {
    throw e;
  }
}

export async function deleteBlog(accessToken: string, blogId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const blog = await BlogsModel.findByIdAndDelete({ _id: blogId });

    if (!blog) {
      return "blog not found";
    }

    return blog;
  } catch (e) {
    throw e;
  }
}
