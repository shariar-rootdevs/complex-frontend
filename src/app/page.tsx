'use client'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import * as z from 'zod'

export default function Home() {
  const additionalSchema = z.discriminatedUnion('isChecked', [
    z.object({
      isChecked: z.literal(true),
      address: z.string().min(1, 'Address is required'),
    }),
    z.object({
      isChecked: z.literal(false),
    }),
  ])

  // const extraSchema = z.discriminatedUnion('extraOptions', [
  //   z.object({
  //     extraOptions: z.literal('bike'),
  //     bikeName: z.string().min(1, 'Bike Name is required'),
  //   }),

  //   z.object({
  //     extraOptions: z.literal('car'),
  //     carName: z.string().min(1, 'Car Name is required'),
  //   }),

  //   z.object({
  //     extraOptions: z.literal('boat'),
  //     boatName: z.string().min(1, 'Car Name is required'),
  //   }),
  // ])

  const schema = z
    .object({
      name: z.string().min(5, 'Name must be at least 10 characters'),
      email: z.string().min(1, 'Email is required').email('Invalid email address'),
      isChecked: z.boolean().optional(),
      extraOptions: z.array(z.string()).min(1, 'Select At least one options'),
      bikeName: z.string().optional(),
      carName: z.string().optional(),
      boatName: z.string().optional(),
      // selectOptions: z.string().optional(),
    })
    .and(additionalSchema)
    .refine((data) => !data.extraOptions.includes('Bike') || !!data.bikeName, {
      message: 'Bike name is required',
      path: ['bikeName'], // correct spelling
    })
    .refine((data) => !data.extraOptions.includes('Car') || !!data.carName, {
      message: 'Car name is required',
      path: ['carName'],
    })
    .refine((data) => !data.extraOptions.includes('Boat') || !!data.boatName, {
      message: 'Boat name is required',
      path: ['boatName'],
    })

  type DataType = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      isChecked: false,
      extraOptions: [],
    },
  })

  const isChecked = watch('isChecked')
  const extraValues = watch('extraOptions')

  const onSubmit = (data: DataType) => {
    console.log('Data is', data)
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-xl bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-5'
      >
        <h1 className='text-4xl font-bold text-center text-gray-800'>Welcome Back 👋</h1>
        <p className='text-sm text-gray-500 text-center'>Please login to continue</p>

        <div className='flex flex-col gap-1'>
          <input
            {...register('name')}
            type='text'
            placeholder='Your name'
            className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
          />
          {errors.name && <span className='text-sm text-red-500'>{errors.name.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <input
            {...register('email')}
            type='email'
            placeholder='shariar@gmail.com'
            className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
          />
          {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
        </div>

        <div className='flex items-center gap-2'>
          <input className='h-4 w-4' type='checkbox' {...register('isChecked')} />
          <label htmlFor='isChecked'>Chose More Options</label>
        </div>

        <div>
          <div>
            <input
              type='checkbox'
              id='vehicle1'
              value='Bike'
              className='h-3 w-3'
              {...register('extraOptions')}
            />
            <label className='text-md ml-1' htmlFor='vehicle1'>
              I have a bike
            </label>
          </div>

          <div>
            <input
              type='checkbox'
              id='vehicle2'
              value='Car'
              className='h-3 w-3'
              {...register('extraOptions')}
            />
            <label className='text-md ml-1' htmlFor='vehicle2'>
              I have a car
            </label>
          </div>

          <div>
            <input
              type='checkbox'
              id='vehicle3'
              value='Boat'
              className='h-3 w-3'
              {...register('extraOptions')}
            />
            <label className='text-md ml-1' htmlFor='vehicle3'>
              I have a boat
            </label>
          </div>
        </div>

        {errors?.extraOptions && (
          <p className='text-sm text-red-500'>{errors.extraOptions.message}</p>
        )}

        <div>
          {isChecked && (
            <div className='flex flex-col gap-1'>
              <input
                {...register('address')}
                type='text'
                placeholder='Your Address'
                className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
              />
              {'address' in errors && errors.address && (
                <span className='text-sm text-red-500'>{errors.address.message}</span>
              )}
            </div>

            // <select
            //   className='w-full py-2 border border-gray-100 px-4'
            //   {...register('selectOptions')}
            // >
            //   <option value='single'>Single</option>
            //   <option value='multiple'>Multiple</option>
            //   <option value='others'>Others</option>
            // </select>
          )}
        </div>

        {extraValues.includes('Bike') && (
          <div className='flex flex-col gap-1'>
            <input
              {...register('bikeName')}
              type='text'
              placeholder='Your Bike Name'
              className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
            />
            {errors.bikeName && (
              <span className='text-sm text-red-500'>{errors.bikeName.message}</span>
            )}
          </div>
        )}

        {extraValues.includes('Car') && (
          <div className='flex flex-col gap-1'>
            <input
              {...register('carName')}
              type='text'
              placeholder='Your Car Name'
              className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
            />
            {errors.carName && (
              <span className='text-sm text-red-500'>{errors.carName.message}</span>
            )}
          </div>
        )}

        {extraValues.includes('Boat') && (
          <div className='flex flex-col gap-1'>
            <input
              {...register('boatName')}
              type='text'
              placeholder='Your Boat Name'
              className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
            />
            {errors.boatName && (
              <span className='text-sm text-red-500'>{errors.boatName.message}</span>
            )}
          </div>
        )}

        <button
          type='submit'
          className='w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl shadow-md transition'
        >
          Login
        </button>

        <p className='text-sm text-gray-500 text-center'>
          Don’t have an account?{' '}
          <a href='#' className='text-green-600 font-medium hover:underline'>
            Sign up
          </a>
        </p>
      </form>
    </div>
  )
}
