/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state: any) => state.userSlice).user;
  const router = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 bg-[#f0f0f0cc] min-h-screen">
      <div className="w-full max-w-4xl mb-4">
        <button
          onClick={() => router(-1)}
          className="flex items-center gap-2 text-[#1967d2] hover:text-[#154db5] font-semibold"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-4xl">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src="https://picsum.photos/200/300" // you can update this to user's photo if you add photo in future
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#1967d2]"
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#1967d2]">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600 capitalize">{user.role}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-300"></div>

        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div>
            <h2 className="text-lg font-semibold text-[#1967d2] mb-2">
              Contact Information
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Email:</strong> {user.email}
              </li>
              {/* If you had phone/address, you could add here */}
            </ul>
          </div>

          {/* Account Info */}
          <div>
            <h2 className="text-lg font-semibold text-[#1967d2] mb-2">
              Account Details
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Role:</strong> {user.role}
              </li>
              {/* Add more details if needed */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
