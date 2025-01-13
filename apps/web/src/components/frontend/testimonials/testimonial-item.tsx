"use client";
import React from "react";
import Image from "../../optimize/image";

const TestimonialItem = ({ data }: { data: any }) => {
  return (
    <div className="p-3">
      <div className="bg-white p-6 rounded-md">
        <div className="flex gap-4 items-center mb-6">
          <div>
            <Image
              width={70}
              height={70}
              className="rounded-full w-auto"
              src={data?.user_image || "/assets/img/avatar.png"}
              alt={data.image_alt}
            />
          </div>
          <div>
            <h4 className="text-lg2 text-black font-normal leading-4 mb-2">
              {data.name}
            </h4>
            <p className="text-grayLight text-xss font-normal">
              {data.position}
            </p>
          </div>
        </div>
        <div className="f">
          <p className="text-xs text-deep font-normal leading-6">
            {data.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialItem;
