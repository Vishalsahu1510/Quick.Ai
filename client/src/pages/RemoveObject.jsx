import { Eraser, Scissors, Sparkles } from 'lucide-react'
import { useState } from 'react'
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');

  const [loading,setLoading] = useState(false);
  const [content, setContent] = useState('');
 
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if(object.split(' ').length > 1){
        return toast('Please enter only one object name')
      }
      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const {data} = await axios.post(
        '/api/ai/remove-image-object',
        formData,
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
      // console.log(error)
    }
    setLoading(false)
  }
  
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

     {/*-------> left column <-------  */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Scissors className="w-6 text-[#437AF5]" />
          <h1 className=" text-xl font-semibold ">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>


        <input onChange={(e)=> setInput(e.target.files[0])}  type="file" accept='image/*' placeholder="The future of artificial intelligence is..." required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md text-sm text-gray-600" />

        <p className="mt-6 text-sm font-medium">Describe object to remove</p>

        <textarea onChange={(e)=> setObject(e.target.value)} value={object} rows={4} placeholder="e.g., car in background, tree from the image" required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A7AFF]" />

        <p className="mt-1 text-xs text-gray-500 font-light">Be specific about what you want to remove</p>

        <button disabled={loading} className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#417DF6] to-[#8E37EB] '>
          {
          loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          : <Scissors className=' w-5'/>
        }
          Remove object
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#437AF5]" />
          <h1 className=" text-xl font-semibold ">Processed Image</h1>
        </div>
        {
          !content ? (
            <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
            <Scissors className=" w-9 h-9" />
            <p className="text-center">Upload an image and describe what to remove</p>
          </div>
        </div>
          ) : (
            
                <img src={content} alt='Image' className=' w-full h-full'/>
              
          )
        }
        

      </div>
    </div>
  )
}

export default RemoveObject