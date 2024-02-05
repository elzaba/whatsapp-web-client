import React, { useEffect, useState } from 'react';
import { TbCircleDashed } from "react-icons/tb";
import { BiCommentDetail } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEmojiSmile, BsFilter, BsMicFill, BsThreeDotsVertical } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import ChatCard from './ChatCard/ChatCard';
import MessageCard from './MessageCard/MessageCard';
import "./HomePage.css"
import { useNavigate } from 'react-router-dom';
import Profile from './Profile/Profile';
import { Menu, MenuItem } from '@mui/material';
import CreateGroup from './Group/CreateGroup';
import { useDispatch, useSelector } from 'react-redux';
import { currentUser, logoutAction, searchUser } from '../Redux/Auth/Action';
import { store } from '../Redux/store';

const HomePage = () => {
    const [querys, setQuerys] = useState(null);
    const [currentChat, setCurrentChat] = useState(null);
    const [content, setContent] = useState("");
    const [isProfile, setIsProfile] = useState(false);
    const navigate = useNavigate();
    const[isGroup,setIsGroup] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const {auth} =useSelector(store=>store);
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOnChatCard = () => [setCurrentChat(true)];

    const handleSearch = (keyword) => {
        dispatch(searchUser({keyword,token}))
    };

    const handleCreateNewMessage = () => {};

    const handleNavigate = () => {
        setIsProfile(true);
    }

    const handleCloseOpenProfile = () => {
        setIsProfile(false);
    }

    const handleCreateGroup = () => {
        setIsGroup(true);
    }

    useEffect(()=>{
        dispatch(currentUser(token))
    },[token])

    const handleLogout = () => {
        dispatch(logoutAction())
        navigate("/signup")
    }

    useEffect(()=>{
        if(!auth.reqUser){
            navigate("/signup")
        }
    },[auth.reqUser])
    return (
        <div className='relative'>
            <div className='w-full py-14 bg-[#00a884]'></div>
            <div className='flex bg-[#f0f2f5] h-[90vh] absolute left-[2vw] top-[5vh] w-[96vw]'>
                <div className='left w-[30%] bg-[#e8e9ec] h-full'>
                    {/* Profile Page */}
                    {isGroup && <CreateGroup/>}
                    {isProfile && <div className='w-full h-full'><Profile handleCloseOpenProfile={handleCloseOpenProfile}/></div>}

                    {!isProfile && !isGroup && <div className='w-full'>
                        
                        {/* Home Page */}
                        {<div className='flex justify-between items-center p-3'>
                            <div onClick={handleNavigate} className='flex items-center space-x-3'>
                                <img
                                    className="rounded-full w-10 h-10 cursor-pointer"
                                    src="https://cdn.pixabay.com/photo/2023/12/04/17/24/evening-8429871_1280.jpg"
                                    alt=""
                                />
                                <p>{auth.reqUser?.full_name}</p>
                            </div>
                            <div className='space-x-3 text-2xl flex'>
                                <TbCircleDashed className='cursor-pointer' onClick={()=>navigate("/status")} />
                                <BiCommentDetail />
                                <div>
                                    <BsThreeDotsVertical
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    />
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleCreateGroup}>Create Group</MenuItem>
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            </div>
                        </div>}

                        <div className='relative flex justify-center items-center bg-white py-4 px-3'>
                            <input
                                className='border-none outline-none bg-slate-200 rounded-md w-[93%] pl-9 py-2'
                                type="text"
                                placeholder='Search or start new chat'
                                onChange={(e) => {
                                    setQuerys(e.target.value)
                                    handleSearch(e.target.value)
                                }}
                                value={querys}
                            />
                            <AiOutlineSearch className='left-5 top-7 absolute' />
                            <div>
                                <BsFilter className='ml-4 text-3xl' />
                            </div>
                        </div>
                        {/* all user */}
                        <div className='bg-white overflow-y-scroll h-[72vh] px-3'>
                            {querys &&
                                [1,1,1,1].map((item) => (
                                    <div onClick={handleClickOnChatCard}>
                                        {" "}
                                        <hr /> <ChatCard />{" "}
                                    </div>
                                ))}
                        </div>

                    </div>}
                </div>

                {/* default whatsapp page */}
                {!currentChat && <div className='w-[70%] flex flex-col items-center justify-center h-full'>
                    <div className='max-w-[70%] text-center'>
                        <img
                            src="https://res.cloudinary.com/zarmariya/image/upload/v1662264838/whatsapp_multi_device_support_update_image_1636207150180-removebg-preview_jgyy3t.png"
                            alt=""
                        />
                        <h1 className='text-4xl text-gray-600'>WhatsApp Web</h1>
                        <p className='my-9'>
                            Send and receive message without keeping your phone online.<br />
                            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                        </p>
                    </div>
                </div>}

                {/* message page */}

                {currentChat && <div className='w-[70%] relative  bg-blue-200'>

                    <div className='header absolute top-0 w-full bg-[#f0f2f5]'>
                        <div className='flex justify-between'>
                            <div className='py-3 space-x-4 flex items-center px-3'>
                                <img className='w-10 h-10 rounded-full' src="https://cdn.pixabay.com/photo/2022/10/17/15/02/photography-7527978_1280.jpg" alt="" />
                                <p>{auth.reqUser?.full_name}</p>
                            </div>
                            <div className='py-3 flex space-x-4 items-center px-3'>
                                <AiOutlineSearch />
                                <BsThreeDotsVertical />
                            </div>
                        </div>
                    </div>
                    {/* message section */}
                    <div className='px-10 h-[85vh] overflow-y-scroll'>
                        <div className='space-y-1 flex flex-col justify-center mt-20 py-2'>
                            {[1, 1, 1, 1, 1].map((item, i) => <MessageCard isReqUserMessage={i % 2 === 0} content={"message"} />)}
                        </div>
                    </div>
                    {/* footer */}

                    <div className='footer bg-[#f0f2f5] absolute bottom-0 w-full py-3 text-2xl'>
                        <div className='flex justify-between items-center px-5 relative'>
                            <BsEmojiSmile className='cursor-pointer' />
                            <ImAttachment />
                            <input
                                className='py-2 outline-none border-none bg-white pl-4 rounded-md w-[85%]'
                                type="text"
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='Type message'
                                value={content}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateNewMessage();
                                        setContent("")
                                    }
                                }}
                            />
                            <BsMicFill />
                        </div>

                    </div>

                </div>}

            </div>
        </div>
    );
};

export default HomePage