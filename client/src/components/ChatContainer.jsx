import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser,sendMessage, getMessages} =useContext(ChatContext);

  const {authUser, onlineUsers} = useContext(AuthContext);

  const scrollEnd = useRef();


  const [input, setInput] = useState('');


  const handleSendMessage = async(e)=>{
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text : input.trim()});
    setInput("");
  };

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  },[selectedUser]);


  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior: 'smooth'})
    }
  },[messages])




  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/* ------header------- */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && ( <span className='w-2 h-2 rounded-full bg-green-500'></span> )}
        </p>
        <img onClick={()=> setSelectedUser(null)} src={assets.arrow_icon} alt="" className='md:hidden max-w-7'/>
        <img src={assets.help_icon} alt="" className='max-md:hidden max-w-5'/>
      </div>
      {/* ------messages------- */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg, index) => (
          <div key={index} className={`flex mb-2 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-[65%] px-3 py-2 rounded-lg text-sm break-words shadow-md
             ${msg.senderId === authUser._id ? "bg-green-900 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none" }`} 
             style={{ borderBottomRightRadius: msg.senderId === authUser._id ? "0" : "0.5rem", borderBottomLeftRadius: msg.senderId !== authUser._id ? "0" : "0.5rem", }}>
              <p className="leading-relaxed">{msg.text}</p>
              <div className="flex justify-end">
                <span className="text-[11px] opacity-70">{formatMessageTime(msg.createdAt)}</span>
              </div>
              <span className={`absolute top-0 w-0 h-0 border-t-[8px] border-t-transparent
              ${msg.senderId === authUser._id ? "right-[-8px] border-l-[12px] border-l-green-900" : "left-[-8px] border-r-[12px] border-r-gray-700"}`}></span>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/* bottom input area */}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null }
           type="text" placeholder='Type a message...' className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
        </div>
        <img  onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
      </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} alt="" className='max-w-16' />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer