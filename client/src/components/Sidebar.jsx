import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems=[
  {to:'/ai', label:'Dashboard', icon:House},
  {to:'/ai/write-article', label:'write-article', icon:SquarePen},
  {to:'/ai/blog-titles', label:'blog-titles', icon:Image},
  {to:'/ai/generate-images', label:'generate-images', icon:Image},
  {to:'/ai/remove-background', label:'remove-background', icon:Eraser},
  {to:'/ai/remove-object', label:'remove-object', icon:Scissors},
  {to:'/ai/review-resume', label:'review-resume', icon:FileText},
  {to:'/ai/community', label:'community', icon:Users}
]

const Sidebar = ({sidebar, setsidebar}) => {
  const {user} = useUser();
  const {signOut, openUserProfile} = useClerk();
  return (
    <div className= {`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' :'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className='my-7 w-full'>
        <img src={user.imageUrl} alt="user-avatar" className='w-13 rounded-full mx-auto' />
        <h1 className='mt-1 text-center '>{user.fullName}</h1>
        <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
          {navItems.map(({to,label,icon:Icon}, index) => (
            <NavLink 
             key={to} 
             to={to} 
             end={to === '/ai'}
            //  onClick={() => setsibar(false)}
            //  className={({isActive}) => `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white': '' }`} 
             >
            {({isActive}) => (
              <div onClick={() => setsidebar(false)} className={`px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : ''}`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                {label}
              </div>
            )}
            </NavLink>
            ))}
        </div>
      </div>
      <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
            <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
              <img src={user.imageUrl} alt="user-avatar" className='w-8  rounded-full' />
              <div className='text-sm font-medium'>
                <h1>{user.fullName}</h1>
                <p className='text-xs text-gray-500'>
                  <Protect plan='premium' fallback='Free'>Premium </Protect>
                  Plan
                </p>
              </div>
            </div>
            <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
      </div>
    </div>
  )
}

export default Sidebar