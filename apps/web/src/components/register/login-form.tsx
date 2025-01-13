"use client"
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsApple } from 'react-icons/bs';
import { FaFacebook, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useToasts } from '@/src/components/toast/toast';
import { ThemeContext } from '@/src/context/ThemeContext'; // Adjusted import path
import { FormLoader } from '@/src/components/lib/loader'; // Adjusted import path

const LoginForm = () => {
  const { lostPasswordHandler } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  
  const { addToast } = useToasts();

  const onSubmitHandler = async (data: any) => {
    setIsLoading(true);
    signIn('credentials', {
      username: data.email,
      password: data.password,
      redirect: true,
    }).then(() => {
      setIsLoading(false);
    }).catch((error) => {
      setIsLoading(false);
      addToast(error.message || 'Login failed', {
        appearance: 'error',
        autoDismiss: true,
      });
    });
  };

  return (
    <div className="max-w-md mx-auto shadow px-8 sm:px-6 py-10 rounded-lg bg-white pb-12 h-3/4">
      <div className="mb-6 text-center">
        <h3 className="mb-4 text-2xl text-themeDarker">Login</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-6">
          <label className="block mb-2 text-themeDarker font-normal" htmlFor="Username">
            Username
          </label>
          <input
            id="Username"
            className={`appearance-none block w-full !p-3 leading-5 text-themeDarker border ${errors?.email ? '!border-red-500' : 'border-gray'} placeholder:font-normal placeholder:text-xss1 rounded-lg placeholder-themeDarkAlt focus:outline-none`}
            type="email"
            {...register('email', { required: true })}
            placeholder="Enter Your Username"
          />
          {errors?.email && (
            <span className="text-red-500 text-xss italic">
              This field is required
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-themeDarker font-normal" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={`appearance-none block w-full !p-3 leading-5 text-themeDarker border ${errors?.password ? '!border-red-500' : 'border-gray'} placeholder:font-normal placeholder:text-xss1 rounded-lg placeholder-themeDarkAlt focus:outline-none`}
            type="password"
            {...register('password', { required: true })}
            placeholder="Enter Your Password"
          />
          {errors?.password && (
            <span className="text-red-500 text-xss italic">
              This field is required
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="w-full md:w-1/2">
            <label className="relative inline-flex items-center">
              <input className="checked:bg-red-500 w-4 h-4" {...register('remember')} type="checkbox" />
              <span className="ml-3 text-sm text-themeDarker font-normal">Remember me</span>
            </label>
          </div>
          <div className="w-full md:w-auto mt-1">
            <button
              className="inline-block text-sm font-normal text-themePrimary hover:text-green-600 hover:underline"
              type="button"
              onClick={lostPasswordHandler}
            >
              Lost password?
            </button>
          </div>
        </div>
        <button
          className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out mb-6 w-full text-base text-white font-normal text-center leading-6 ${isLoading ? 'bg-themeDarkerAlt' : 'bg-themePrimary'} rounded-md hover:bg-black`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Login'}
          {isLoading && <FormLoader />}
        </button>
        <p className="text-center flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-deep font-normal">Not a Member?</span>
          <Link legacyBehavior href="/sign-up">
            <a className="inline-block text-sm font-normal text-themePrimary hover:text-green-600 hover:underline">Create Account</a>
          </Link>
        </p>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
        <button
          className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out w-full text-base text-white font-normal text-center leading-6 rounded-md bg-black hover:opacity-70`}
          onClick={() => signIn('github')}
        >
          <FaGithub className="text-2xl" /> Sign in
        </button>
        <button
          className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out w-full text-base text-white font-normal text-center leading-6 rounded-md bg-black hover:opacity-70`}
          onClick={() => signIn('google')}
        >
          <FcGoogle className="text-2xl" /> Sign in
        </button>
        {/* Facebook Login */}
        <button
          className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out w-full text-base text-white font-normal text-center leading-6 rounded-md bg-black hover:opacity-70`}
          onClick={() => signIn('facebook')}
        >
          <FaFacebook className="text-2xl" /> Sign in
        </button>
        {/* Linkedin Login */}
        <button
          className={`!py-3 px-7 flex gap-2 justify-center items-center transition-all duration-300 ease-in-out w-full text-base text-white font-normal text-center leading-6 rounded-md bg-black hover:opacity-70`}
          onClick={() => signIn('linkedin')}
        >
          <FaLinkedin className="text-2xl" /> Sign in
        </button>
        {/* Apple login */}
        <button
          className={`!py-3 px-7 flex gap-2 col-span-2 justify-center items-center transition-all duration-300 ease-in-out w-full text-base text-white font-normal text-center leading-6 rounded-md bg-black hover:opacity-70`}
          onClick={() => signIn('apple')}
        >
          <BsApple className="text-2xl" /> Sign in
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
