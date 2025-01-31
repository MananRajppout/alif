"use client";
import { LocationIcon, MailIcon, PhoneIcon } from "@/src/icons";
import Link from "next/link";

const footerCandidate = [
  {
    name: "Browse jobs",
    link: "/find-job",
  },
  {
    name: "Browse category",
    link: "/all-categories",
  },
  {
    name: "Candidate Dashboard",
    link: "/dashboard",
  },
  {
    name: "Job Alert",
    link: "/job/job-alerts",
  },
  {
    name: "My Bookmarks",
    link: "/bookmarks",
  },
];
const footerEmployer = [
  {
    name: "Browse candidates",
    link: "/candidate",
  },
  {
    name: "Browse category",
    link: "/all-categories",
  },
  {
    name: "Employer Dashboard",
    link: "/dashboard",
  },
  {
    name: "Post a Job",
    link: "/job/submit-job",
  },
  {
    name: "My Bookmarks",
    link: "/bookmarks",
  },
];

const quickLink = [
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Contact Us",
    link: "/contact-us",
  },
  {
    name: "Privacy Policy",
    link: "/privacy-policy",
  },
  {
    name: "Terms of Use",
    link: "/terms-of-use",
  },
  {
    name: "FAQ",
    link: "/faq",
  },
];

const Footer = () => {
  const FullYear = new Date().getFullYear();

  return (
    <>
      {/* Footer Component */}
      <footer className="bg-black overflow-hidden">
        <div className="container">
          <div className="md:grid gap-8 md:grid-cols-12 pt-16 pb-14">
            <div className="xl:col-span-4 lg:col-span-4 md:col-span-12 mb-10 xl:mb-0 xl:pr-10">
              <h3 className="text-lg text-white font-bold mb-8 leading-4">
                About Company
              </h3>
              <p
                className="text-xxs font-normal leading-6 mb-6"
                style={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Our company is a job portal where companies post jobs and candidates apply. What makes us unique is our <span className="font-body text-white static">weekly hiring events</span>, where companies directly connect and hire talent.
              </p>
              <div className="text-xxs text-white font-normal leading-6 mb-6 flex gap-4 items-center">
                <LocationIcon className="text-themePrimary" />
                Company Location here - Lorem{" "}
                <br className="hidden xl:inline" /> Ipsum is simple Dummy Text
              </div>
              <a
                href="tel:1-202-555-0106"
                className="text-xxs text-white font-normal leading-6 mb-6 flex gap-4 items-center"
              >
                <PhoneIcon className="text-themePrimary" />
                1-202-555-0106
              </a>
              <a
                href="mailto:info@example.com"
                className="text-xxs text-white font-normal leading-6 mb-0 flex gap-4 items-center"
              >
                <MailIcon className="text-themePrimary" />
                info@example.com
              </a>
            </div>
            <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 mb-10 xl:mb-0 xl:pl-10">
              <h3 className="text-lg text-white font-bold mb-8 leading-4">
                For Candidates
              </h3>
              {footerCandidate.map((item, index) => (
                <Link legacyBehavior href={item.link} key={index}>
                  <a className="text-xs text-themeLighter  font-normal leading-6 mb-4 block transition-all duration-300 hover:text-themePrimary">
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
            <div className="xl:col-span-3 lg:col-span-4 md:col-span-6 mb-10 xl:mb-0 xl:pl-6">
              <h3 className="text-lg text-white font-bold mb-8 leading-4">
                For Employer
              </h3>
              {footerEmployer.map((item, index) => (
                <Link legacyBehavior href={item.link} key={index}>
                  <a className="text-xs text-themeLighter  font-normal leading-6 mb-4 block transition-all duration-300 hover:text-themePrimary">
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
            <div className="xl:col-span-2 lg:col-span-4 md:col-span-6 mb-10 xl:mb-0">
              <h3 className="text-lg text-white font-bold mb-8 leading-4">
                Quick Link
              </h3>
              {quickLink.map((item, index) => (
                <Link legacyBehavior href={item.link} key={index}>
                  <a className="text-xs text-themeLighter  font-normal leading-6 mb-4 block transition-all duration-300 hover:text-themePrimary">
                    {item.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div
            className="flex justify-between py-7"
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <p className="text-xs text-white leading-4">
              © {FullYear} Mata Jobs | All Right Reserved
            </p>
            <ul className="social flex gap-6">
              <li>
                <Link legacyBehavior href="/">
                  <a className="text-white hover:text-themePrimary">
                    <svg
                      width="11"
                      height="18"
                      viewBox="0 0 11 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.59548 10.125L10.0843 6.86742H7.028V4.75348C7.028 3.86227 7.45494 2.99355 8.82376 2.99355H10.2132V0.220078C10.2132 0.220078 8.95232 0 7.74678 0C5.22984 0 3.58465 1.56023 3.58465 4.38469V6.86742H0.786865V10.125H3.58465V18H7.028V10.125H9.59548Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/">
                  <a className="text-white hover:text-themePrimary">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.1497 5.33381C16.1612 5.4937 16.1612 5.65363 16.1612 5.81352C16.1612 10.6904 12.4493 16.3097 5.66497 16.3097C3.57486 16.3097 1.63325 15.7043 0 14.6536C0.296965 14.6879 0.582469 14.6993 0.890859 14.6993C2.61545 14.6993 4.20303 14.1168 5.4708 13.1232C3.84898 13.0889 2.48984 12.0267 2.02155 10.5648C2.25 10.599 2.47841 10.6219 2.71828 10.6219C3.04949 10.6219 3.38073 10.5762 3.68909 10.4963C1.99874 10.1536 0.730934 8.66884 0.730934 6.8757V6.83003C1.22203 7.10414 1.79314 7.27546 2.39843 7.29827C1.40477 6.63582 0.753785 5.50513 0.753785 4.22593C0.753785 3.54067 0.936492 2.9125 1.25631 2.36427C3.0723 4.60284 5.80201 6.06475 8.86289 6.22467C8.8058 5.95056 8.77152 5.66505 8.77152 5.37952C8.77152 3.3465 10.4162 1.69043 12.4606 1.69043C13.5228 1.69043 14.4822 2.13586 15.156 2.8554C15.9898 2.69551 16.7893 2.38712 17.4974 1.96454C17.2233 2.82116 16.6408 3.5407 15.8756 3.99752C16.618 3.91761 17.3375 3.71198 17.9999 3.42648C17.4975 4.15741 16.8693 4.8084 16.1497 5.33381Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/">
                  <a className="text-white hover:text-themePrimary">
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.0853 4.36229C18.8672 3.53085 18.2246 2.87603 17.4088 2.6538C15.93 2.25 10.0001 2.25 10.0001 2.25C10.0001 2.25 4.07019 2.25 2.59133 2.6538C1.77547 2.87606 1.1329 3.53085 0.914805 4.36229C0.518555 5.86934 0.518555 9.01364 0.518555 9.01364C0.518555 9.01364 0.518555 12.1579 0.914805 13.665C1.1329 14.4964 1.77547 15.124 2.59133 15.3462C4.07019 15.75 10.0001 15.75 10.0001 15.75C10.0001 15.75 15.9299 15.75 17.4088 15.3462C18.2246 15.124 18.8672 14.4964 19.0853 13.665C19.4816 12.1579 19.4816 9.01364 19.4816 9.01364C19.4816 9.01364 19.4816 5.86934 19.0853 4.36229ZM8.06064 11.8684V6.15885L13.0169 9.01371L8.06064 11.8684Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </Link>
              </li>
              <li>
                <Link legacyBehavior href="/">
                  <a className="text-white hover:text-themePrimary">
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.58143 15.7501H0.264286V5.2349H3.58143V15.7501ZM1.92107 3.80053C0.860357 3.80053 0 2.93568 0 1.89154C7.59214e-09 1.39 0.202398 0.909006 0.562669 0.554365C0.92294 0.199724 1.41157 0.000488281 1.92107 0.000488281C2.43057 0.000488281 2.9192 0.199724 3.27947 0.554365C3.63974 0.909006 3.84214 1.39 3.84214 1.89154C3.84214 2.93568 2.98143 3.80053 1.92107 3.80053ZM15.9964 15.7501H12.6864V10.6314C12.6864 9.41146 12.6614 7.84701 10.9618 7.84701C9.23714 7.84701 8.97286 9.1724 8.97286 10.5435V15.7501H5.65929V5.2349H8.84071V6.66927H8.88714C9.33 5.8431 10.4118 4.97123 12.0257 4.97123C15.3829 4.97123 16 7.1474 16 9.97396V15.7501H15.9964Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
      {/* Footer End */}

      {/* <footer className="mt-10 flex h-16 w-full items-center justify-center border-t">
        © {FullYear} Tailwindkits. All rights reserved. | Privacy Policy
      </footer> */}
    </>
  );
};

export default Footer;
