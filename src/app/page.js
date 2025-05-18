// src/app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, useUser, UserButton } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
  const [isPro, setIsPro] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  // on mount, check whether this user has a Pro subscription
  useEffect(() => {
    if (user) {
      fetch('/api/check-subscription')
        .then((r) => r.json())
        .then((data) => setIsPro(data.isPro))
        .catch(() => setIsPro(false));
    }
  }, [user]);

  // your FFmpeg upload logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const form = new FormData();
      form.append('video', e.target.video.files[0]);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'enhanced.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
        <div className="text-2xl font-bold">SCALUXE</div>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <a href="/sign-in" className="text-purple-400 hover:underline">Login</a>
            <a href="/sign-up" className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded font-semibold">Sign Up</a>
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
        <p className="text-gray-400 max-w-xl mx-auto">
          The ultimate high-quality video enhancement service. Transform your clips into TikTok-ready masterpieces.
        </p>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mt-16 flex justify-center">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
          <p className="text-gray-400 mb-4">£9.99/mo or £99/yr</p>
          <ul className="text-left mb-6 space-y-2 text-gray-300">
            <li>Unlimited video enhancements</li>
            <li>1080p & 4K AI upscaling</li>
            <li>Priority processing</li>
            <li>Future AI features</li>
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

      {/* Upload (gated behind Pro) */}
      <section id="upload" className="mt-16 w-full flex justify-center px-4">
        <SignedOut>
          <p className="text-gray-400">
            Please <a href="/sign-in" className="text-purple-400 hover:underline">sign in</a> and subscribe to enhance your videos.
          </p>
        </SignedOut>
        <SignedIn>
          {!isPro ? (
            <p className="text-gray-400">
              Upgrade to <a href="#pricing" className="text-purple-400 hover:underline">Premium</a> to use this feature.
            </p>
          ) : (
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
                onChange={(e) => setFile(e.target.files[0] || null)}
                className="w-full bg-gray-800 p-2 rounded"
              />
              {file && <p className="text-sm text-gray-400">Selected: {file.name}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold"
              >
                {loading ? 'Enhancing…' : 'Enhance Video'}
              </button>
              {loading && <p className="text-gray-400 text-center">Processing your video…</p>}
              {status && <p className="text-center text-gray-400">{status}</p>}
            </form>
          )}
        </SignedIn>
      </section>

      <footer className="mt-32 text-sm text-gray-500">© 2025 Scaluxe. All rights reserved.</footer>
    </main>
  );
}