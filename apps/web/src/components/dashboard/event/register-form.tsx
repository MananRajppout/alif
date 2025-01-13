import React, { Dispatch, FC, SetStateAction } from 'react'


interface IProps {
  setStep: Dispatch<SetStateAction<"register" | "workflow">>
  name: string,
  description: string,
  role: string,
  setName: Dispatch<SetStateAction<string>>,
  setDescription: Dispatch<SetStateAction<string>>,
  setRole: Dispatch<SetStateAction<string>>
}

const RegisterForm: FC<IProps> = ({ setStep,name,setName,description, setDescription, role, setRole }) => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 ">Create Interview Event</h2>
      <form onSubmit={() => setStep('workflow')} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 mt-2 border border-gray-100"
            placeholder='Name of the event'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 mt-2 border border-gray-100"
            placeholder='Description of the event'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="roleType" className="block text-sm font-medium text-gray-700">
            Interview Role Type
          </label>
          <select
            id="roleType"
            name="roleType"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 mt-2 border border-gray-100"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select a role type</option>
            <option value="software-engineer">Software Engineer</option>
            <option value="product-manager">Product Manager</option>
            <option value="designer">Designer</option>
            <option value="data-scientist">Data Scientist</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          Next
        </button>
      </form>
    </div>
  )
}

export default RegisterForm