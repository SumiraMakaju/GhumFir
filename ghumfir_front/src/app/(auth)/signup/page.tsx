import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="flex h-screen">
      <div className="flex w-full h-full">
        {/* Cover Image Section */}
        <div className="relative w-1/2 h-full">
          <Image
            src="/machapuchrevector.jpg"
            alt="Signup Image"
            layout="fill"
            objectFit="cover"
            className="rounded-l-2xl"
          />
        </div>
        {/* Form Section */}
        <div className="flex w-1/2 flex-col justify-center space-y-10 p-10 bg-white rounded-r-2xl shadow-lg dark:bg-gray-900">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">Start your journey now!</p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center text-blue-500 hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
