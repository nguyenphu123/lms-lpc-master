"use client";
const Avatar = ({ imageUrl }: any) => {
  return (
    <img
      className="inline object-cover w-16 h-16 mr-2 rounded-full"
      src={imageUrl}
      alt="Profile image"
    />
  );
};

export default Avatar;
