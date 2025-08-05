import { DownloadCloudIcon, DownloadIcon, Eraser, Sparkles } from 'lucide-react'
import { useState } from 'react'
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState('');


  const [loading,setLoading] = useState(false);
  const [content, setContent] = useState('');
 
  const {getToken} = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append('image', input);

      const {data} = await axios.post(
        '/api/ai/remove-image-background',
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

  const downloadImage = async (imageUrl) => {
    try {
      // Fetch image as a blob
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();

      // Create temporary object URL
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "image_By_QuickAi.png"; // Filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }
  
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

     {/*-------> left column <-------  */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className=" text-xl font-semibold ">Background Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>


        <input onChange={(e)=> setInput(e.target.files[0])}  type="file" accept='image/*' placeholder="The future of artificial intelligence is..." required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md text-sm text-gray-600" />

        <p className="mt-1 text-xs text-gray-500 font-light">Supports JPG, PNG, and other image formats</p>

        <button disabled={loading} className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#F6AB41] to-[#FF4938] '>
        {
          loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          : <Eraser className=' w-5'/>
        }
          Remove background
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className=' flex justify-between'>
          <div className="flex items-center gap-3">
            <Eraser className="w-5 h-5 text-[#FF4938]" />
            <h1 className=" text-xl font-semibold ">Processed Image</h1>
          </div>

          {content ? (<button disabled={loading}
                onClick={() => downloadImage(content)}
                  className="mt-2 px-4 py-2 bg-[#FF4938] text-white rounded-lg text-sm text-center w-fit self-end"
                >
                  Download Image
          </button>
          ): (
            <DownloadIcon className="w-5 h-5 text-[#FF4938]" />
            )}
        </div>
        {
          !content ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
                <Eraser className=" w-9 h-9" />
                <p className="text-center">Upload an image and click "Remove Background" to get started</p>
              </div>
            </div>
          ):(
            <div className='mt-3 h-full'>
                <img src={content} alt='Image' className=' w-full h-full'/>
              </div>
          )
        }
        

      </div>
    </div>
  )
}

export default RemoveBackground