import React, { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthProvider'
import { useForm } from 'react-hook-form';

const UserProfile = () => {
    const {updateUserProfile} = useContext(AuthContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm()
      const onSubmit = (data) => {
        const name = data.name;
        const photoURL = data.photoURL;

        updateUserProfile(name, photoURL).then(() => {
            // Profile updated!
            toast.success('Sign Up Successfull', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            navigate("/");
          }).catch((error) => {
            // An error occurred
            // ...
          });
      }
  return (
    <div className='h-screen max-w-md mx-auto flex items-center justify-center '>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
      <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input type="text" {...register("name")} placeholder="Your name" className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Enter Image Url</span>
          </label>
          <input type="text" {...register("photoURL")} placeholder="Your Url" className="input input-bordered" required />
          {/* <input type="text" {...register("photoURL")} placeholder="photo url" className="input input-bordered" required /> */}
        </div>
        <div className="form-control mt-6">
          <input type='submit' value={"Update"} className="btn bg-green text-white"/>
        </div>
      </form>
    </div>
    </div>
  )
}

export default UserProfile