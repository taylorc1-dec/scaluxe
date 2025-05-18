'use client';

import { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs';

export default function Home() {
  const [status, setStatus] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(''); setLoading(true);
    const form = new FormData();
    form.append('video', e.target.video.files[0]);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'enhanced.mp4'; a.click();
      setStatus('✅ Download started');
    } catch {
      setStatus('❌ Processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gray-900 px-6 py-3 flex justify-between items-center z-10">
        <div className="text-2xl font-bold tracking-widest">SCALUXE</div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <a href="/sign-in" className="text-purple-400 hover:underline">Login</a>
            <a href="/sign-up" className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded">Sign Up</a>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
      <div className="h-16" />

      {/* Hero */}
      <section className="text-center mt-12 space-y-4">
        <h1 className="text-5xl font-extrabold">SCALUXE</h1>
        <p className="text-gray-400 max-w-xl">
          The ultimate high–quality video enhancement service.  
          Transform your clips into TikTok-ready masterpieces.
        </p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mt-16 flex justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
          <p className="text-gray-400 mb-4">£19/mo or £190/yr</p>
          <ul className="text-left mb-6 space-y-2 text-gray-300">
            <li>• Unlimited video enhancements</li>
            <li>• 1080p & 4K AI upscaling</li>
            <li>• Priority processing</li>
            <li>• Future AI features</li>
          </ul>
          <SignedOut>
            <a href="/sign-up" className="block bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold">
              Get Started
            </a>
          </SignedOut>
          <SignedIn>
            <a href="/subscribe" className="block bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-semibold">
              Subscribe Now
            </a>
          </SignedIn>
        </div>
      </section>

      {/* Upload (gated) */}
     {/* Upload (gated) */}
<section
  id="upload"
  className="mt-16 w-full flex justify-center"
>
  {/* When the user is signed out, show a “please sign in” link */}
  <SignedOut>
    <p className="text-gray-400">
      Please{" "}
      <a
        href="/sign-in"
        className="text-purple-400 hover:underline"
      >
        sign in
      </a>{" "}
      and subscribe to enhance your videos.
    </p>
  </SignedOut>

  {/* When the user is signed in, show the real uploader form */}
  <SignedIn>
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="bg-gray-900 p-6 rounded-2xl shadow-lg max-w-md w-full space-y-4"
    >
      <label className="block text-gray-300">Upload Video</label>
      <input
        type="file"
        name="video"
        accept="video/*"
        required
        onChange={(e) =>
          setFileName(e.target.files?.[0]?.name || "")
        }
        className="w-full bg-gray-800 p-2 rounded"
      />
      {fileName && (
        <p className="text-sm text-gray-400">
          Selected: {fileName}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold"
      >
        {loading ? "Enhancing…" : "Enhance Video"}
      </button>

      {loading && (
        <p className="text-gray-400 text-center">
          Processing your video…
        </p>
      )}

      {status && (
        <p className="text-center text-gray-400">{status}</p>
      )}
    </form>
  </SignedIn>
</section>

      {/* Footer */}
      <footer className="mt-20 mb-8 text-gray-500 text-sm">
        © 2025 SCALUXE. All rights reserved.
      </footer>
    </main>
  );
}