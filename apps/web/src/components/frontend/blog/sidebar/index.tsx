"use client";

import AdvertisementVertical from "./AdvertisementVertical";
import SidebarCategory from "./SidebarCategory";
import SidebarPopularPost from "./SidebarPopularPost";

const Sidebar = ({ data }: any) => {
  return (
    <div className="flex flex-col gap-8 ">
      <SidebarPopularPost data={data} />
      <SidebarCategory />
      <AdvertisementVertical />
    </div>
  );
};

export default Sidebar;
