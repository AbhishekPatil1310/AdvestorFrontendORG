import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../store';
import { Adregister } from '../store/authSlice';

// Helper component for cleaner input rendering
const InputField = ({ name, type = 'text', placeholder, required = true, value, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required={required}
    value={value}
    onChange={onChange}
    className="w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-500 shadow-sm transition duration-150 ease-in-out focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
  />
);

export default function AdSignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'advertiser',
    companyName: '',
    mobileNumber: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (form.role === 'user') {
        delete payload.companyName;
        delete payload.mobileNumber;
      }

      await dispatch(Adregister(payload)).unwrap();
      // ✅ Save email for OTP verification
      localStorage.setItem('emailForOtp', form.email);
      navigate('/verify-otp');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <div className='text-center'>
          <svg className="mx-auto h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Sign up as an Advertiser
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started creating your advertising campaigns.
          </p>
        </div>

        {/* ── SIGN‑UP FORM ─────────────────────────────── */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          <InputField name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <InputField type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
          <InputField type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />

          {/* Additional Fields for Advertiser */}
          {form.role === 'advertiser' && (
            <>
              <InputField name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} />
              <InputField name="mobileNumber" type="tel" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} />
            </>
          )}

          {/* Hidden Role Input */}
          <input type="hidden" name="role" value={form.role} />


          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-3 px-4 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* Loading Spinner */}
              {status === 'loading' && (
                <svg className="-ml-1 mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {status === 'loading' ? 'Processing…' : 'Create Advertiser Account'}
            </button>
          </div>
        </form>

        {/* --- Divider and Google Sign-in (If applicable for 'advertiser') --- */}
        {form.role === 'advertiser' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            

          </>
        )}

        {/* Error message */}
        {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}

        {/* Switch to sign‑in */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/Adsignin" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition duration-150">
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
