import { useState } from 'react';
import { Sparkles, Hash } from 'lucide-react';


const BlogTitles = () => {
  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Travel', 'Education', 'Entertainment', 'Sports', 'Food',
  ]

  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

  }

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">

     {/*-------> left column <-------  */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className=" text-xl font-semibold ">AI Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>


        <input onChange={(e)=> setInput(e.target.value)} value={input} type="text" placeholder="The future of artificial intelligence is..." required className="w-full mt-2 p-2 px-3 outline-none border border-gray-300 rounded-md text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A7AFF]" />
        <p className="mt-6 text-sm font-medium">Category</p>
        <div className="mt-2 flex flex-wrap gap-3 sm:max-w-9/11">
          {
            blogCategories.map((item) => (
              <span onClick={()=> setSelectedCategory(item)} key={item} className= {`text-xs px-4 py-1 bg-[#F4F7FB] border border-gray-300 rounded-full cursor-pointer hover:bg-[#E5E9F2] transition-colors ${selectedCategory === item ? ' bg-purple-50 text-purple-700' : ' text-gray-500 border-gray-300'}`}>
                {item}
              </span>
            ))
          }
        </div>
        <br/>
        <button className=' w-full flex items-center justify-center gap-2 px-4 py-2 mt-6 text-sm text-white  rounded-lg bg-gradient-to-r from-[#C341F6] to-[#8E37EB] '>
          <Hash className=' w-5'/>
          Generate title
        </button>
        
      </form>


      {/* --------------------->right column <--------------- */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 ">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-[#8E37EB]" />
          <h1 className=" text-xl font-semibold ">Generated titles</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col text-sm items-center gap-5 text-gray-400">
            <Hash className=" w-9 h-9" />
            <p className="text-center">Enter a topic and click "Generated title" to get started</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default BlogTitles