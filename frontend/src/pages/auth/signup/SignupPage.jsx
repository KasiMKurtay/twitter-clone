import { useState } from "react";
import {
  MdDriveFileRenameOutline,
  MdOutlineMail,
  MdPassword,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import XSvg from "../../../components/svgs/X";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    username: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <XSvg className="lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join Us</h1>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={formData.email}
            />
          </label>
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow"
                placeholder="username"
                name="username"
                onChange={handleChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2  flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleChange}
                value={formData.fullName}
              />
            </label>
          </div>
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-full btn-primary text-white">
            Sign Up
          </button>
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg items-center">
            Already have an Acc?
          </p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary w-full text-white btn-outline">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
