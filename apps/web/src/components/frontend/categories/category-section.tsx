"use client"
import CategoryItemTwo from "./category-item-two";


const CategorySection = ({ categoryData }: { categoryData: any }) => {
  return (
    <div className="lg:grid grid-cols-12 gap-6 mb-20">
      <div className="col-span-12">
        <div className="mb-6 lg:mb-0 text-center">
          <h3 className="text-black font-bold leading-10 text-xl mb-8">
            {/* {data.name} */}
            All Categories
          </h3>
        </div>
      </div>
      <div className="col-span-12">
        <div className="grid gap-6 xl:grid-cols-4 md:grid-cols-2">
          {categoryData && categoryData.length >0 && categoryData.map((category: any, index: any) => (
              <CategoryItemTwo key={index} category={category} />
            
  ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection;
