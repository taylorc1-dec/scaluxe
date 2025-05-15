// src/app/sign-up/page.jsx
"use client";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ maxWidth: 400, margin: "4rem auto" }}>
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}