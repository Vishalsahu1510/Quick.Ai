import { useState } from 'react';
import { Sparkles, Hash, Image } from 'lucide-react';
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Generatelmages = () => {
  const imagestyle= ['Realistic','Fantasy style','Ghibli style', 'Realistic style', '3D style','Anime style', 'Portrait style', 'cartoon style']

  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);


  const [loading,setLoading] = useState(false);
  const [content, setContent] = useState('');
 
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt =`Generate an image of ${input} in the ${selectedStyle} style`

      const {data} = await axios.post(
        '/api/ai/generate-image',
        {prompt,publish},
      {
        headers: {
          'Authorization': `Bearer ${await getToken()}`
        }
      })

      if(data.success){
        setContent(data.content)
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error)
      
    }
    setLoading(false)
  }

  
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

     {/*-------> left column <-------  */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h1 className=" text-xl font-semibold ">AI Image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>


        <textarea onChange={(e)=> setInput(e.target.value)} value={input} rows={4} placeholder="Describe what you want to see in the image.." required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A7AFF]" />
        <p className="mt-6 text-sm font-medium">Style</p>
        <div className="mt-2 flex flex-wrap gap-3 sm:max-w-9/11">
          {
            imagestyle.map((item) => (
              <span onClick={()=> setSelectedStyle(item)} key={item} className= {`text-xs px-4 py-1 bg-[#F4F7FB] border border-gray-300 rounded-full cursor-pointer  transition-colors ${selectedStyle === item ? ' bg-green-50 text-green-700' : ' text-gray-500 border-gray-300'}`}>
                {item}
              </span>
            ))
          }
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer' >
            <input type="checkbox"  onChange={(e)=> setPublish(e.target.checked)} checked={publish} className='sr-only peer' />


            <div className="w-9 h-5 rounded-full border peer-checked:bg-green-500 transition bg-gray-300"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
            <p  className='text-sm '>Make this image Public</p>
        </div>



        
        <button disabled={loading} className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#00AD25] to-[#04FF50] '>
        {
          loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          : <Image className=' w-5'/>
        }
          Generate image
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#00AD25]" />
          <h1 className=" text-xl font-semibold ">Generated image</h1>
        </div>
        {
          !content ? 
          (

             <div className="flex-1 flex items-center justify-center">
               <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
                 <Hash className=" w-9 h-9" />
                 <p className="text-center">Describe an image and click "Generate Image" to get started</p>
               </div>
             </div>
          ) : (
              <div className='mt-3 h-full'>
                <img src={content} alt='Image' className=' w-full h-full'/>
              </div>
          )
        }

      </div>
    </div>
  )
}

export default Generatelmages