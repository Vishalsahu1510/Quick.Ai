import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import {dummyPublishedCreationData} from '../assets/assets'
import { Heart } from 'lucide-react'
const Community = () => {

  const [creations, setCreations] = useState([])
  const {user} = useUser()
  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(()=>{
    if (user) {
      fetchCreations()
    }
  },[user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations
      <div className=' bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {
          creations.map((creation, index) => (
            <div key={index} className=' relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
              <img src={creation.content} alt='' className=' w-full h-full object-cover rounded-lg'/>
              <div className=' absolute bottom-0 left-0 right-0 flex justify-end items-end gap-2  text-white group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/85 rounded-lg  '>
                <p className=' text-sm hidden group-hover:block' >{creation.prompt}</p>
                <div className=' flex items-center gap-1'>
                  <p>{creation.likes.length}</p>
                  <Heart className={`min-w-5 h-5 hover:scale-110 cursor-pointer &{creation.likes.includes(user.id) ? ' fill-red-500 text-red-600': ' text-white'}`} />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Community