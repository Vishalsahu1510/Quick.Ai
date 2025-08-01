import { Eraser, Sparkles } from 'lucide-react'
import { useState } from 'react'

const RemoveBackground = () => {
  const [input, setInput] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

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

        <button className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#F6AB41] to-[#FF4938] '>
          <Eraser className=' w-5'/>
          Remove background
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#FF4938]" />
          <h1 className=" text-xl font-semibold ">Processed Image</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
            <Eraser className=" w-9 h-9" />
            <p className="text-center">Upload an image and click "Remove Background" to get started</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RemoveBackground