import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate()
	const { auth, setAuth } = useContext(AuthContext)
	const [errorsMessage, setErrorsMessage] = useState('')
	const [isLoggingIn, SetLoggingIn] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm()

	const onSubmit = async (data) => {
		SetLoggingIn(true)
		try {
			const response = await axios.post('/auth/login', data)
			// console.log(response.data)
			toast.success('Login successful!', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
			setAuth((prev) => ({ ...prev, token: response.data.token }))
			navigate('/')
		} catch (error) {
			console.error(error.response.data)
			setErrorsMessage(error.response.data)
			toast.error('Error', {
				position: 'top-center',
				autoClose: 2000,
				pauseOnHover: false
			})
		} finally {
			SetLoggingIn(false)
		}
	}

	const inputClasses = () => {
		return 'appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500'
	}

	return (
<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-500 py-12 px-4 sm:px-6 lg:px-8"
style={{ backgroundImage: "url('../src/back-movie.jpg')" }}>
    <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/10 backdrop-blur-md p-6 shadow-2xl border border-white/20">
        <div>
            <h2 className="mt-4 text-center text-4xl font-extrabold text-white">Login</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input
                name="username"
                type="text"
                autoComplete="username"
                {...register('username', { required: true })}
                className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 shadow-md"
                placeholder="Username"
            />
            {errors.username && <span className="text-sm text-red-400">Username is required</span>}

            <input
                name="password"
                type="password"
                autoComplete="current-password"
                {...register('password', { required: true })}
                className="appearance-none rounded-lg block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:border-blue-500 shadow-md"
                placeholder="Password"
            />
            {errors.password && <span className="text-sm text-red-400">Password is required</span>}

            <div>
                {errorsMessage && <span className="text-sm text-red-400">{errorsMessage}</span>}
                <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 py-3 px-4 font-semibold text-white drop-shadow-md transition-all duration-300 hover:scale-105 hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-500 disabled:to-gray-400"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? 'Processing...' : 'Login'}
                </button>
            </div>
            <p className="text-center text-white">
                Don’t have an account?{' '}
                <Link to={'/register'} className="font-bold text-blue-300 hover:underline">
                    Register here
                </Link>
            </p>
        </form>
    </div>
</div>

	)
}

export default Login
