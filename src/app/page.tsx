'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
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

  const schema = z
    .object({
      name: z.string().min(5, 'Name must be at least 10 characters'),
      email: z.string().min(1, 'Email is required').email('Invalid email address'),
      isChecked: z.boolean().optional(),
      extraOptions: z.array(z.string()).min(1, 'Select At least one options'),
      extraDetails: z.string().min(1, 'Please select at least one details option'),
      bikeName: z.string().optional(),
      carName: z.string().optional(),
      boatName: z.string().optional(),
      personalData: z.string().optional(),
      educationalData: z.string().optional(),
      careerData: z.string().optional(),
      multihobby: z.array(z.object({ game: z.string(), favouritePlayer: z.string() })),
    })
    .and(additionalSchema)
    .refine((data) => !data.extraOptions.includes('Bike') || !!data.bikeName, {
      message: 'Bike name is required',
      path: ['bikeName'],
    })
    .refine((data) => !data.extraOptions.includes('Car') || !!data.carName, {
      message: 'Car name is required',
      path: ['carName'],
    })
    .refine((data) => !data.extraOptions.includes('Boat') || !!data.boatName, {
      message: 'Boat name is required',
      path: ['boatName'],
    })
    .superRefine((data, ctx) => {
      if (data.extraDetails === 'personal' && !data.personalData) {
        ctx.addIssue({
          path: ['personalData'],
          message: 'Personal Data is required',
          code: 'custom',
        })
      }

      if (data.extraDetails === 'personal') {
        if (data.multihobby.length <= 0) {
          ctx.addIssue({
            path: ['multihobby'],
            message: 'At least One hobby is required',
            code: 'custom',
          })
        } else {
          data.multihobby.forEach((hobby, index) => {
            if (!hobby.game?.trim()) {
              ctx.addIssue({
                path: ['multihobby', index, 'game'],
                message: 'Game is required',
                code: 'custom',
              })
            }
            if (!hobby.favouritePlayer?.trim()) {
              ctx.addIssue({
                path: ['multihobby', index, 'favouritePlayer'],
                message: 'Player Name is required',
                code: 'custom',
              })
            }
          })
        }
      }

      if (data.extraDetails === 'education' && !data.educationalData) {
        ctx.addIssue({
          path: ['educationalData'],
          message: 'Education Info is required',
          code: 'custom',
        })
      }

      if (data.extraDetails === 'job' && !data.careerData) {
        ctx.addIssue({
          path: ['careerData'],
          message: 'Career Info is required',
          code: 'custom',
        })
      }
    })

  // .refine((data) => data.extraDetails === 'personal' || !!data.personalData, {
  //   message: 'Personal Data is required',
  //   path: ['personalData'],
  // })
  // .refine((data) => data.extraDetails === 'education' || !!data.educationalData, {
  //   message: 'Education Info is required',
  //   path: ['educationData'],
  // })
  // .refine((data) => data.extraDetails === 'career' || !!data.careerData, {
  //   message: 'Career Info is required',
  //   path: ['careerData'],
  // })

  type DataType = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<DataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      isChecked: false,
      extraOptions: [],
      multihobby: [
        {
          game: 'Cricket',
          favouritePlayer: 'AB Devillers',
        },

        {
          game: 'football',
          favouritePlayer: 'Messi',
        },
      ],
    },
  })

  const isChecked = watch('isChecked')
  const extraValues = watch('extraOptions')
  const extraDetails = watch('extraDetails')

  const allhobies = useFieldArray({ control, name: 'multihobby' })

  const addNewHobby = () => {
    allhobies.append({ game: '', favouritePlayer: '' })
  }

  console.log(errors)

  const onSubmit = (data: DataType) => {
    console.log('Data is', data)
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-6'
      >
        <h1 className='text-4xl font-bold text-center text-gray-800'>Welcome Back 👋</h1>
        <p className='text-sm text-gray-500 text-center'>Please login to continue</p>

        {/* Name */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Name</label>
          <input
            {...register('name')}
            type='text'
            placeholder='Your name'
            className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
          />
          {errors.name && <span className='text-sm text-red-500'>{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium text-gray-700'>Email</label>
          <input
            {...register('email')}
            type='email'
            placeholder='shariar@gmail.com'
            className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
          />
          {errors.email && <span className='text-sm text-red-500'>{errors.email.message}</span>}
        </div>

        {/* Checkbox for more options */}
        <div className='flex items-center gap-2'>
          <input className='h-4 w-4' type='checkbox' {...register('isChecked')} />
          <label htmlFor='isChecked' className='text-sm font-medium text-gray-700'>
            Provide Your Address
          </label>
        </div>

        {isChecked && (
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Address</label>
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
        )}
        <select
          {...register('extraDetails')}
          className='border border-gray-300 p-4 rounded-md'
          defaultValue=''
        >
          <option value='' disabled>
            Select a Details Option
          </option>
          <option value='personal'>Personal Info</option>
          <option value='education'>Education Info</option>
          <option value='job'>Job Info</option>
        </select>

        {/* This section for more details */}
        <div>
          <div>
            {extraDetails === 'personal' && (
              <div className='flex flex-col gap-4'>
                <div>
                  <label className='text-sm font-medium text-gray-700'>
                    Write Some Personal Interest
                  </label>
                  <input
                    {...register('personalData')}
                    type='text'
                    placeholder='Your personal Info'
                    className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
                  />
                  {errors.personalData && (
                    <span className='text-sm text-red-500'>{errors.personalData.message}</span>
                  )}{' '}
                </div>

                <div>
                  <p className='text-sm pb-[2px]'>Favourite Sports and Game</p>
                  {allhobies.fields.length > 0 ? (
                    allhobies.fields.map((feild, index) => (
                      <div key={index} className=''>
                        <div className='flex items-center gap-4 mb-4'>
                          <div className='w-full'>
                            <input
                              type='text'
                              {...register(`multihobby.${index}.game`)}
                              placeholder='Game Name'
                              className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
                            />
                            <div className='h-5 text-red-500 text-sm'>
                              {errors.multihobby?.[index]?.game?.message}
                            </div>
                          </div>

                          <div className='w-full'>
                            <input
                              type='text'
                              {...register(`multihobby.${index}.favouritePlayer`)}
                              placeholder='Favourite Player'
                              className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
                            />

                            <div className='h-5 text-red-500 text-sm'>
                              {errors.multihobby?.[index]?.favouritePlayer?.message}
                            </div>
                          </div>

                          <div>
                            <Trash
                              onClick={() => allhobies.remove(index)}
                              size={24}
                              className='cursor-pointer'
                              color='#FF0000'
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-md text-gray-500 my-3'>Add Some hobbies if you want ...</p>
                  )}

                  {errors.multihobby && (
                    <p className='text-red-500 font-bold text-sm mb-2'>
                      {' '}
                      {errors.multihobby.message}
                    </p>
                  )}

                  <div>
                    <button
                      type='button'
                      onClick={addNewHobby}
                      className='w-[130px] p-2 bg-green-500 text-white rounded-2xl cursor-pointer'
                    >
                      Add More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {extraDetails === 'education' && (
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Write about your education
              </label>
              <input
                {...register('educationalData')}
                type='text'
                placeholder='Your education background'
                className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
              />
              {errors.educationalData && (
                <span className='text-sm text-red-500'>{errors.educationalData.message}</span>
              )}{' '}
            </div>
          )}

          {extraDetails === 'job' && (
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Write Something about your Career
              </label>
              <input
                {...register('careerData')}
                type='text'
                placeholder='Your Current Job'
                className='border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 transition w-full'
              />
              {errors.careerData && (
                <span className='text-sm text-red-500'>{errors.careerData.message}</span>
              )}{' '}
            </div>
          )}
        </div>

        {errors.extraDetails && (
          <p className='text-red-500 font-bold'>{errors?.extraDetails?.message}</p>
        )}
        {/* Extra Options */}
        <div className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-gray-700'>Select Vehicles</span>
          <div className='flex flex-col gap-1 ml-2'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                value='Bike'
                className='h-4 w-4'
                {...register('extraOptions')}
              />
              I have a bike
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                value='Car'
                className='h-4 w-4'
                {...register('extraOptions')}
              />
              I have a car
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                value='Boat'
                className='h-4 w-4'
                {...register('extraOptions')}
              />
              I have a boat
            </label>
          </div>
          {errors?.extraOptions && (
            <p className='text-sm text-red-500'>{errors.extraOptions.message}</p>
          )}
        </div>

        {/* Address (if checked) */}

        {/* Bike Name */}
        {extraValues.includes('Bike') && (
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Bike Name</label>
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

        {/* Car Name */}
        {extraValues.includes('Car') && (
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Car Name</label>
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

        {/* Boat Name */}
        {extraValues.includes('Boat') && (
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-gray-700'>Boat Name</label>
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

        {/* Submit */}
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
