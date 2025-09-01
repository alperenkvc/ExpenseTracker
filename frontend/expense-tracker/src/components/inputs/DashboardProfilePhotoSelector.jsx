import React, { useRef, useState, useContext } from 'react';
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import { UserContext } from '../../context/UserContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-hot-toast';
import { getInitials } from '../../utils/helper';

const DashboardProfilePhotoSelector = () => {
  const { user, updateUser } = useContext(UserContext);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      try {
        // Upload the new image
        const imgUploadRes = await uploadImage(file);
        const newImageUrl = imgUploadRes.imageUrl || "";

        // Update the user profile
        const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
          profileImageUrl: newImageUrl
        });

        if (response.data.user) {
          updateUser(response.data.user);
          toast.success("Profile picture updated successfully!");
        }
      } catch (error) {
        console.error("Error updating profile picture:", error);
        toast.error("Failed to update profile picture");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveImage = async () => {
    setIsLoading(true);
    try {
      // Update the user profile to remove the image
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        profileImageUrl: ""
      });

      if (response.data.user) {
        updateUser(response.data.user);
        toast.success("Profile picture removed successfully!");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='relative'>
      <input
        type="file"
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      <div className='relative w-20 h-20'>
        {user?.profileImageUrl ? (
          <>
            <img
              src={user.profileImageUrl}
              alt='profile photo'
              className='w-20 h-20 rounded-full object-cover'
            />
            
            <button
              type='button'
              disabled={isLoading}
              className='w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full absolute bottom-0 right-0 border border-white hover:bg-red-600 disabled:opacity-50'
              onClick={handleRemoveImage}
              title="Remove profile picture"
            >
              <LuTrash size={14} />
            </button>
          </>
        ) : (
          <>
            <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full text-gray-900 font-medium text-xl'>
              {getInitials(user?.fullName || "")}
            </div>

            <button
              type='button'
              disabled={isLoading}
              className='w-6 h-6 flex items-center justify-center bg-primary text-white rounded-full absolute bottom-0 right-0 border border-white hover:bg-purple-600 disabled:opacity-50'
              onClick={onChooseFile}
              title="Upload profile picture"
            >
              <LuUpload size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardProfilePhotoSelector;
