const PageTitle = ({
  title,
  excerpt,
  image,
}: {
  title?: string;
  excerpt?: any;
  image?: any;
}) => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: image
          ? `url(${image || "/assets/img/findjob-banner-bg.svg"})`
          : "url(/assets/img/findjob-banner-bg.svg)",
      }}
    >
      <div className="absolute inset-0 bg-themePrimary/70 z-10" />
      <div className="relative z-20 container p-16 mx-auto">
        <div className="w-10/12 mx-auto pt-10 pb-7">
          <div className="text-center">
            <h1 className="text-xxl xl:text-xxxl font-bold text-white leading-none mb-6">
              {title || "Page Title"}
            </h1>
            {excerpt && (
              <p className="text-xs text-white leading-relaxed mb-6">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;
