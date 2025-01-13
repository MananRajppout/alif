"use client"
import { FormLoader } from "@/src/components/lib/loader";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useToasts } from "@/src/components/toast/toast";
import sweetAlert from "sweetalert";
import { useSWRConfig } from "swr";
import capitalize from "../../../lib/capitalize";
import { authAxios } from "../../../utils/axiosKits";

const Skills = ({ data }: { data: any }) => {
  const { mutate } = useSWRConfig();
  const [Skills, setSkills] = React.useState([]) as any;
  const [processing, setProcessing] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const { addToast } = useToasts();

  const addSkills = (value: any) => {
    if (data.includes(capitalize(value.type))) {
      setError("type", {
        type: "manual",
        message: "This Skills already exists!",
      });
    } else {
      if (!Skills.includes(capitalize(value.type))) {
        setSkills([...Skills, capitalize(value.type)]);
        reset();
      } else {
        setError("type", {
          type: "manual",
          message: "This Skills already exists!",
        });
      }
    }
  };

  const addAllSkills = () => {
    setProcessing(true);
    const newSkills = [...Skills, ...(Array.isArray(data) ? data : [])];
    if (!_.isEqual(newSkills, data)) {
      try {
        authAxios({
          method: "POST",
          url: `/admin/filters/retrives`,
          data: {
            skills: newSkills,
          },
        }).then((res) => {
          mutate("/admin/filters/retrives").then(() => {
            addToast(res.data.message, {
              appearance: "success",
              autoDismiss: true,
            });
            setSkills([]);
            setProcessing(false);
          });
        });
      } catch (error: any) {
        addToast(error.response.data.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setProcessing(false);
      }
    }
    setTimeout(() => {
      setProcessing(false);
    }, 10000);
  };

  const removeSkills = (index: any) => {
    const newSkills = [...Skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <h3 className="text-xxs">Creat Skills</h3>
        {/* Add job Skills form */}
        <form onSubmit={handleSubmit(addSkills)}>
          <div
            className={`mt-3 w-full border-2 ${
              errors && errors.type ? "border-red-400" : "border-gray"
            } rounded-lg flex flex-wrap gap-3 px-2 py-1 items-center`}
          >
            {Skills.length > 0 && (
              <>
                {Skills.map((tag: any, index: any) => (
                  <span
                    key={index}
                    className="py-1 pl-3 pr-2 flex justify-between items-center gap-2 bg-themePrimary/10 text-themeLight"
                  >
                    <span className="text-xs">{tag}</span>
                    <span className="cursor-pointer p-1 group">
                      <MdClose
                        onClick={() => removeSkills(index)}
                        className="group-hover:text-red-400 text-xxs text-themeLight"
                      />
                    </span>
                  </span>
                ))}
              </>
            )}
            <input
              type="text"
              {...register("type", {
                required: "Skills is required",
              })}
              className="border-2 border-none p-2 w-full rounded-lg focus:outline-none"
              placeholder="Add Skills"
            />
          </div>
          {errors && errors.type && (
            <p className="text-xs text-red-400 p-2">
              {/* @ts-ignore */}
              {errors.type.message}
            </p>
          )}
        </form>
        <button
          type="button"
          onClick={addAllSkills}
          disabled={Skills.length === 0 || processing}
          className={`px-4 py-2.5 flex gap-3 items-center mt-8 ${
            Skills.length === 0 ? "opacity-50" : "opacity-100"
          } rounded-md ${
            processing ? "bg-themeDarkerAlt" : "bg-themePrimary"
          } text-white  shadow-themePrimary hover:shadow-lg`}
        >
          {processing ? "Please wait..." : "Add Skills"}
          {processing && <FormLoader />}
        </button>
      </div>
      <div>
        <PreviewMode data={data} />
      </div>
    </div>
  );
};

const PreviewMode = ({ data }: { data: any }) => {
  const { mutate } = useSWRConfig();
  const [filter, setFilterData] = React.useState([]) as any;
  const { addToast } = useToasts();

  React.useEffect(() => {
    if (data) setFilterData(data);
  }, [data]);

  const searchHandler = (value: any) => {
    const filtered = _.filter(data, (item) => {
      return item.toLowerCase().includes(value.toLowerCase());
    });

    if (value === "") {
      setFilterData(data);
    } else {
      setFilterData(filtered);
    }
  };

  const itemRemoveHandler = (index: any) => {
    const newData = _.filter(filter, (item) => item !== index);
    sweetAlert({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this item!",
      icon: "warning",
      buttons: true as any,
    }).then((willDelete) => {
      if (willDelete) {
        authAxios({
          method: "POST",
          url: `/admin/filters/retrives`,
          data: {
            skills: newData,
          },
        })
          .then(() => {
            mutate("/admin/filters/retrives").then(() => {
              setFilterData(newData);
              addToast("Skills Deleted Successfully", {
                appearance: "success",
                autoDismiss: true,
              });
            });
          })
          .catch(() => {
            addToast("Error Deleting Skills", {
              appearance: "error",
              autoDismiss: true,
            });
          });
      }
    });
  };

  return (
    <section className="rounded-lg bg-themePrimary/10 min-h-[550px] h-full">
      <div className="bg-themePrimary rounded-tl-lg rounded-tr-lg px-4 py-2 text-white text-xs font-semibold">
        <div className="flex gap-3 justify-between items-center w-full">
          <h3>Preview</h3>
          <div>
            <SearchBox searchHandler={searchHandler} />
          </div>
        </div>
      </div>
      <div className="p-4 overflow-y-auto overflow-x-hidden h-[550px] !pb-10">
        <h3 className="text-xs font-semibold mb-7">Skills</h3>
        {filter.length > 0 ? (
          <>
            {_.map(_.sortBy(filter), (tag, index) => (
              <div
                className="flex justify-between items-center !py-3 border-b last-of-type:border-none border-gray"
                key={index}
              >
                <h3 className="text-themeLight text-xs">{tag}</h3>
                <div
                  className="p1 group cursor-pointer"
                  onClick={() => itemRemoveHandler(tag)}
                >
                  <FiTrash2 className="text-2xl text-themeLight group-hover:text-red-400" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <p className="text-xs text-red-400 p-2">No data found! ☹️</p>
        )}
      </div>
    </section>
  );
};

const SearchBox = ({ searchHandler }: { searchHandler: any }) => {
  return (
    <div className="relative">
      <form onSubmit={searchHandler}>
        <button type="submit" className="absolute left-3 !top-3 cursor-pointer">
          <FiSearch className="text-lg2 text-themeLight" />
        </button>
        <input
          type="text"
          onChange={(e) => searchHandler(e.target.value)}
          className="border-2 border-themePrimary/10 bg-themePrimary/10 text-themeLight rounded-lg focus:outline-none w-full pl-9 pr-3 py-2"
          placeholder="Search"
        />
      </form>
    </div>
  );
};

export default Skills;
