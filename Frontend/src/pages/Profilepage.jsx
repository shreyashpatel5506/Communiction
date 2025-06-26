// ✅ ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { usePeoples } from '../StoreValues/peoples.store';
import { Camera, Mail, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import avatar from '../assets/avatar-default-symbolic.svg'; // Default avatar image
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { authuser, updateProfile, isUpdateProfile } = useAuth();
  const {
    followers,
    pendingrequestUsers,
    sendingRequestUsers,
    fetchFollowers,
    fetchPendingRequest,
    fetchSendingRequest,
    acceptFollowRequest,
    rejectFollowRequest,
  } = usePeoples();

  const [selectedImg, setSelectedImg] = useState(null);
  const [name, setName] = useState(authuser?.name || '');

  useEffect(() => {
    fetchFollowers();
    fetchPendingRequest();
    fetchSendingRequest();
  }, []);

  const handleUpdateProfileImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setSelectedImg(reader.result);
    toast.success('Image selected. Click "Update Profile" to save.');
  };

  const handleFullProfileUpdate = async () => {
    if (!name && !selectedImg) return toast.error("Nothing to update");

    try {
      await updateProfile({
        name: name !== authuser.name ? name : undefined,
        profilePicture:
          selectedImg && selectedImg.trim() !== authuser.profilePicture
            ? selectedImg
            : undefined,
      });

    } catch (error) {

      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start px-4 pt-24 pb-4 gap-4 min-h-screen overflow-auto">
      <div className="w-full md:w-1/2 max-w-xl bg-base-300 rounded-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-zinc-400">Your profile information</p>
        </div>

        <div
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => setSelectedImg(reader.result);
              toast.success("Image dropped. Click 'Update Profile' to save.");
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-32 h-32 rounded-full border-4 overflow-hidden mx-auto shadow-md"
        >
          <img
            src={selectedImg || authuser.profilePicture || avatar}
            alt="Profile"
            className="object-cover w-full h-full"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute -bottom-3 -right-3 bg-white hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 border-2 border-white shadow-xl ${isUpdateProfile ? 'animate-pulse pointer-events-none' : ''}`}
          >
            <Camera className="w-5 h-5 text-black z-10" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleUpdateProfileImage}
              disabled={isUpdateProfile}
            />
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
              disabled={isUpdateProfile}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authuser?.email}</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleFullProfileUpdate}
            disabled={isUpdateProfile}
            className="btn btn-primary mt-4"
          >
            {isUpdateProfile ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 max-w-xl bg-base-300 rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Followers & Requests</h2>

        <div>
          <h3 className="text-lg font-medium mb-2">Followers</h3>
          <div className="grid grid-cols-2 gap-3">
            {Array.isArray(followers) && followers.map((follower) => (
              <div key={follower._id} className="bg-base-200 p-3 rounded-lg flex items-center gap-3">
                <img
                  src={follower.profilePicture || avatar}
                  alt={follower.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-sm">{follower.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
          <div className="space-y-2">
            {Array.isArray(pendingrequestUsers) && pendingrequestUsers.map((request) => (
              <div key={request._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={request.profilePicture || avatar}
                    alt={request.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{request.name}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      acceptFollowRequest(request._id);
                      fetchPendingRequest();
                      Navigate("/profile");
                      // Refresh pending requests
                    }}
                    className="px-3 py-1 text-white bg-green-600 rounded-lg text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      rejectFollowRequest(request._id);
                      fetchPendingRequest(); // Refresh pending requests
                      Navigate("/profile");
                    }}
                    className="px-3 py-1 text-white bg-red-600 rounded-lg text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Sent Requests</h3>
          <div className="space-y-2">
            {Array.isArray(sendingRequestUsers) && sendingRequestUsers.map((request) => (
              <div key={request._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={request.profilePicture || avatar}
                    alt={request.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-medium">{request.name}</span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
