"use client";

import PostListCardWithoutBorder from "./PostListCardWithoutBorder";

type SidebarProps = {
  data?: any;
};

const SidebarPopularPost = ({ data }: SidebarProps) => {
  const postData = data && data?.length > 0 ? data : [1, 2, 3, 4, 5, 6];
  return (
    <div className="p-8 border border-gray shadow-md rounded-xl w-full bg-white">
      <h3 className="text-themeDarkerAlt font-bold text-2xl font-work">
        Latest Post
      </h3>
      <div className="grid grid-cols-1 gap-6 mt-8">
        {postData?.slice(0, 6)?.map((item: any, index: number) => (
          <PostListCardWithoutBorder cardData={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default SidebarPopularPost;
