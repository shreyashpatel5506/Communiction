import React, { useEffect, useState } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { usePeoples } from '../StoreValues/peoples.store';
import { Camera, Mail, User } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image, name: authuser.name });
    };
  };

  const handleUpdateName = async () => {
    if (name !== authuser?.name) {
      await updateProfile({ name, profilePicture: selectedImg || authuser.profilePicture });
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-4 gap-4">
      {/* Profile Info Section */}
      <div className="w-full md:w-1/2 max-w-xl bg-base-300 rounded-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p>Your profile information</p>
        </div>

        <div className="flex flex-col items-center gap-4 relative">
          <img
            src={selectedImg || authuser.profilePicture || '/avatar.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-1/3 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdateProfile ? 'animate-pulse pointer-events-none' : ''}`}
          >
            <Camera className="w-5 h-5 text-base-200" />
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
        <p className="text-sm text-zinc-400 text-center">
          {isUpdateProfile ? 'Uploading...' : 'Click the camera icon to update your photo'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleUpdateName}
              className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authuser?.email}</p>
          </div>
        </div>

        <div className="mt-6 bg-base-200 rounded-xl p-4">
          <h2 className="text-lg font-medium mb-4">Account Information</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between border-b py-2">
              <span>Member Since</span>
              <span>{authuser.createdAt?.split('T')[0]}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="w-full md:w-1/2 max-w-xl bg-base-300 rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-center">Followers & Requests</h2>

        <div>
          <h3 className="text-lg font-medium mb-2">Followers</h3>
          <div className="grid grid-cols-2 gap-3">
            {Array.isArray(followers) && followers.map((follower) => (
              <div key={follower._id} className="bg-base-200 p-3 rounded-lg flex items-center gap-3">
                <img
                  src={follower.profilePicture || '/avatar.png'}
                  alt={follower.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{follower.name}</h4>
                  <p className="text-xs text-zinc-400">{follower.email}</p>
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
                <span>{request.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFollowRequest(request._id)}
                    className="px-3 py-1 text-white bg-green-600 rounded-lg text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFollowRequest(request._id)}
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
                <span>{request.name}</span>
                <span className="text-sm text-zinc-400">Request sent</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
