import React from "react";
import { useState } from "react";
import { BsArrowLeft, BsCheck2, BsPencil } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Redux/Auth/Action";
import SimpleSnackbar from "./SimpleSnackbar";

const Profile = ({ handleBack }) => {
  const { auth } = useSelector((store) => store);
  const [tempPicture, setTempPicture] = useState(null);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(auth.reqUser.full_name);
  const [flag, setFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const data = {
    id: auth.reqUser?.id,
    token: localStorage.getItem("token"),
    data: { full_name:username },
  };

  const handleClose = () => setOpen(false);
  return (
    <div className=" w-full h-full">
      <div className=" flex items-center space-x-10 bg-[#008069] text-white pt-16 px-10 pb-5">
        <BsArrowLeft
          onClick={handleBack}
          className="cursor-pointer text-2xl font-bold"
        />
        <p className="text-xl font-semibold">Profile</p>
      </div>

      <div className="flex flex-col justify-center items-center my-12">
        <label htmlFor="imgInput">
          <img
            className="rounded-full w-[15vw] h-[15vw] cursor-pointer"
            src={tempPicture || auth.reqUser.profile_picture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"}
            alt=""
          />
        </label>

        <input
          type="file"
          id="imgInput"
          className="hidden"
          onChange={(e) => {
            const uploadPic = (pics) => {
              const data = new FormData();
              data.append("file", pics);
              fetch("http://localhost:5454/api/media/photo", {
                method: "POST",
                headers: {
                  "Authorization":`Bearer ${localStorage.getItem("token")}`
                },
                body: data,
              })
                .then((res) => res.json())
                .then((data) => {
                  setTempPicture(data.filePath);
                  setMessage("profile image updated successfully")
                  setOpen(true);
                  console.log("imgurl", data.filePath);
                  const dataa = {
                    id: auth.reqUser.id,
                    token: localStorage.getItem("token"),
                    data: { profile_picture: data.filePath },
                  };
                  dispatch(updateUser(dataa));
                  
                });
            };
            if (!e.target.files) return;

            uploadPic(e.target.files[0]);
          }}
        />
      </div>

      <div className="bg-white px-3 ">
        <p className="py-3">Your Name</p>
        {!flag && (
          <div className="w-full flex justify-between items-center">
            <p className="py-3">{username || auth.reqUser?.full_name}</p>
            <BsPencil
              onClick={() => {
                setFlag(true);
                console.log(flag, "-----");
              }}
              className="cursor-pointer"
            />
          </div>
        )}

        {flag && (
          <div className="w-full flex justify-between items-center py-2">
            <input
              onChange={(e) => setUsername(e.target.value)}
              className="w-[80%] outline-none border-b-2 border-blue-700 px-2  py-2"
              type="text"
              placeholder="Enter you name"
              value={username}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  dispatch(updateUser(data));
                  setFlag(false);
                }
              }}
            />
            <BsCheck2
              onClick={() => {
                setMessage("name updated successfully")
                dispatch(updateUser(data));
                setFlag(false);
                setOpen(true);
              }}
              className="cursor-pointer text-2xl"
            />
          </div>
        )}
      </div>

      <div className="px-3 my-5">
        <p className="py-10">
          this is not your username, this name will be visible to your whatapp
          contects.
        </p>
      </div>

      <SimpleSnackbar
        message={message}
        open={open}
        handleClose={handleClose}
        type={"success"}
      />
    </div>
  );
};

export default Profile;
