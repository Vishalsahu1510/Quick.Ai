import { Sparkles,Edit } from "lucide-react"
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    {length: 800, text: 'Short (500-800 words)'},
    {length: 1200, text: 'Medium (800-1200 words)'},
    {length: 1600, text: 'Long (1200+ words)'},
  ]

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [content, setContent] = useState('');
 
  const {getToken} = useAuth();
   

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt =`Write an article about ${input} in ${selectedLength.text}`

      const {data} = await axios.post(
        '/api/ai/generate-article',
        {prompt,length:selectedLength.length},
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

     {/* left column  */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className=" text-xl font-semibold ">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>


        <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder="The future of artificial intelligence is..." required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A7AFF]" />
        <p className="mt-6 text-sm font-medium">Article Length</p>
        <div className="mt-2 flex flex-wrap gap-3 sm:max-w-9/11">
          {
            articleLength.map((item,index) => (
              <span onClick={()=> setSelectedLength(item)} key={index} className= {`text-xs px-4 py-1 bg-[#F4F7FB] border border-gray-300 rounded-full cursor-pointer hover:bg-[#E5E9F2] transition-colors ${selectedLength.text === item.text ? ' bg-blue-50 text-blue-700' : ' text-gray-500 border-gray-300'}`}>
                {item.text}
              </span>
            ))
          }
        </div>
        <br/>
        <button disabled={loading} className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#226BFF] to-[#65ADFF] hover:bg-[#3a5bbf] transition-colors'>
        {
          loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          : <Edit className=' w-5'/>
        }
          Generate article
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className=" text-xl font-semibold ">Generated article</h1>
        </div>

        { !content ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
            <Edit className=" w-9 h-9" />
            <p className="text-center">Enter a topic and click "Generate article" to get started</p>
            </div>
          </div>
        ) : (
          <div className=" mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className='reset-tw'>
              <Markdown >{content}</Markdown>
            </div>
          </div>
        )}
        

      </div>
    </div>
  )
}

export default WriteArticle