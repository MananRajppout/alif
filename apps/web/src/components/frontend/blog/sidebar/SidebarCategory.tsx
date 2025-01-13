"use client";

const dummyData = [
  {
    name: "Technology",
    count: 50,
  },
  {
    name: "Lifestyle",
    count: 34,
  },
  {
    name: "Photography",
    count: 12,
  },
  {
    name: "Health & Fitness",
    count: 36,
  },
  {
    name: "Business",
    count: 91,
  },
  {
    name: "Marketing",
    count: 47,
  },
];

const SidebarCategory = () => {
  return (
    <div className="rounded-xl border border-gray shadow-md bg-white p-8">
      <h3 className="text-2xl font-semibold leading-6 text-base-content">
        Category
      </h3>
      <div className="pt-6">
        {dummyData.map(
          (item: { name: string; count: number }, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between last:border-none border-b border-gray py-2.5"
            >
              <span className="text-base font-medium text-base-content text-opacity-70 capitalize hover:text-primary transition ease-in-out duration-300">
                {item?.name}
              </span>
              <span className="px-2 py-1 rounded-md bg-primary bg-opacity-5 text-primary text-xs font-medium">
                {item?.count}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SidebarCategory;
