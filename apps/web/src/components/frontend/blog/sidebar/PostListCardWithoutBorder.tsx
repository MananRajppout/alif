"use client";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";

type PostListCardWithoutBorderProps = {
  cardData?: any;
};

export const PostListCardWithoutBorder = ({
  cardData,
}: PostListCardWithoutBorderProps) => {
  return (
    <div className="card">
      {/* card body section  */}
      <div className="card-body p-0">
        <div className="flex items-center gap-4 font-work">
          <figure className="flex-none">
            <Link legacyBehavior href={`/blog/single-blog`}>
              <a>
                <Image
                  src={cardData?.cover_image || "https://placehold.it/110x90"}
                  alt={"post-thumb"}
                  className="rounded-md object-cover"
                  width={100}
                  height={90}
                  quality={75}
                  placeholder="blur"
                  blurDataURL={
                    cardData?.cover_image || "https://placehold.it/110x90"
                  }
                />
              </a>
            </Link>
          </figure>
          <div>
            <h5>
              <Link legacyBehavior href={`/blog/single-blog`}>
                <a className="font-work line-clam-2 font-semibold text-base text-themeDarkerAlt leading-5 hover:text-themePrimary transition hover:duration-300">
                  {cardData?.title ||
                    `All the Stats, Facts, and Data You will Ever Need to Know`}
                </a>
              </Link>
            </h5>
            <p className="mt-2.5 text-themeDarkerAlt/60 text-sm">
              {moment(cardData?.date).format("ll")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostListCardWithoutBorder;
