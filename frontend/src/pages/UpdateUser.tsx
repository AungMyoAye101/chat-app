import { axiosInstance } from "@/lib/axios.config"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { inputData, type RegisterType } from "./Register"



const UpdateUser = () => {
  const [data, setData] = useState<RegisterType>({
    name: '',
    email: '',
    password: '',
  })
  const [status, setStatus] = useState<{ isLoading: boolean, errorMessage: string }>({
    isLoading: false,
    errorMessage: ''
  })
  const navigate = useNavigate()
  const { userId } = useParams()
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    console.log(data)
    setStatus(pre => ({ ...pre, isLoading: true }))
    try {
      const res = await axiosInstance.put(`/api/user/update/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      })
      console.log(res.data)
      navigate('/')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        setStatus(pre => ({ ...pre, errorMessage: error.message }))
      }
    } finally {
      setStatus(pre => ({ ...pre, isLoading: false }))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(pre => ({ ...pre, [name]: value }))
  }

  return (
    <section className="container flex justify-center mt-4">
      <form onSubmit={handleSubmit} className=' shadow-xl rounded-lg border border-neutral-100 bg-white  px-4 py-6 flex flex-col gap-4 min-w-xs w-full max-w-xl'>

        <h1 className='text-2xl font-bold font-serif text-center'>Signup </h1>
        <div className="flex justify-center gap-4">
          <img src={'/vite.svg'} alt="profile image" className="w-20 h-20 rounded-full bg-neutral-200 border-2 border-purple-400" />
          <Link to={`/image/upload/${userId}`}>Upload Profile</Link>
        </div>


        {
          inputData.map((field, i) => (
            <label htmlFor={field.label} key={i}>
              <span className='capitalize font-medium font-serif'>{field.label}</span>
              <input
                type={field.type}
                placeholder={field.placeholder}
                name={field.name}
                onChange={(e) => handleChange(e)}
                className='block w-full mt-1'
              />
            </label>
          ))
        }


        <button type='submit' className='bg-blue-400 text-white  px-4 py-2 rounded-lg'>{status.isLoading ? "Submiting..." : "Submit"}</button>
        {
          status.errorMessage && <p className='text-red-400 text-sm '>{status.errorMessage}</p>
        }
      </form>
    </section>
  )
}

export default UpdateUser