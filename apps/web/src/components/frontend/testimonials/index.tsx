"use client"
import _ from "lodash";
import React, { useRef } from "react";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import TestimonialItem from "./testimonial-item";

const Testimonials = ({ data }: { data: any }) => {
  const swiperRef = useRef<any>(null);

  const gotoNext = () => {
    if (swiperRef.current) swiperRef.current.swiper.slideNext();
  };

  const gotoPrev = () => {
    if (swiperRef.current) swiperRef.current.swiper.slidePrev();
  };

  const settings = {
    spaceBetween: 30,
    slidesPerView: 3,
    loop: true,
    autoplay: {
      delay: 5000,
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
      },
      800: {
        slidesPerView: 2,
      },
      600: {
        slidesPerView: 1,
      },
    },
  };

  return (
    <section className="testimonial-section py-16 md:py-20 lg:py-24 bg-light">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-themePrimary font-bold text-xs leading-none mb-1">
            Our Reviews
          </p>
          <h2 className="text-xl font-bold text-black">
            What Our Customer Saying
          </h2>
        </div>

        <div className="relative">
          {data?.length > 3 ? (
            <>
              <div className="absolute top-1/3 -translate-y-1/2 w-full z-10">
                <button
                  onClick={() => gotoPrev()}
                  className="2xl:-left-10 -left-3 top-7 absolute rounded-full flex justify-center items-center hover:bg-themePrimary h-10 w-10 bg-gray hover:text-white p-1"
                >
                  <BiLeftArrowAlt className="w-6 h-6" />
                </button>
                <button
                  onClick={() => gotoNext()}
                  className="2xl:-right-10 -right-3 top-7 absolute rounded-full flex justify-center items-center hover:bg-themePrimary h-10 w-10 bg-gray hover:text-white p-1"
                >
                  <BiRightArrowAlt className="w-6 h-6" />
                </button>
              </div>

              {/* Swiper Slider */}
              <Swiper
                {...settings}
                navigation={false}
                modules={[Navigation, Autoplay]}
                ref={swiperRef}
              >
                {_.map(data, (item: any, index: any) => (
                  <SwiperSlide key={index}>
                    <TestimonialItem data={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </>
          ) : (
            <div className="flex flex-wrap justify-center">
              {_.map(data, (item: any, index: React.Key | null | undefined) => (
                <div key={index} className="w-full md:w-1/2 lg:w-1/3">
                  <TestimonialItem data={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;