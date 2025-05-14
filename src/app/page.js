"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("❌ Please choose a video first");
    setLoading(true);
    setStatus("⏳ Processing…");

    try {
      const form = new FormData();
      form.append("video", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enhanced.mp4";
      document.body.append(a);
      a.click();
      a.remove();

      setStatus("✅ Download started");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error during processing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Ultra HD Video Enhancer</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br />
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Enhancing…" : "Enhance Video"}
        </button>
      </form>
      <p style={{ marginTop: "1rem" }}>{status}</p>
    </main>
  );
}