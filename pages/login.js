import React from 'react'

const login = () => {
  return (
    <div className='flex min-h-[calc(80dvh-64px)] flex-col'>
        <div className='flex-1'>
           <section className='mx-auto max-w-7xl p-8'>
            <div className='mx-auto mt-16 w-full max-w-lg'>
                  <form className="rounded border p-8 shadow-md">
                    <div className='mb-2'>
                     {/* <label>Email</label> */}
                     <input type='email' placeholder='Email' className='w-full rounded border bg-neutral-50 px-4 py-2'/>
                    </div>
                    <div className='mb-4'>
                     {/* <label for="password">Password</label> */}
                     <input type='password' placeholder='Password' className='w-full rounded border bg-neutral-50 px-4 py-2'/>
                    </div>
                    <button className='rounded bg-neutral-800 px-4 py-2 text-neutral-200 hover:bg-neutral-700'>
                      Log In
                    </button>
                  </form>
            </div>
           </section>
        </div>

    </div>
  )
}

export default login