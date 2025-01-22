import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "./google/GoogleSignInButton";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
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
        <div className="flex w-1/2 flex-col justify-center space-y-10 p-10 bg-white rounded-r-2xl shadow-lg">
          <h1 className="text-center text-3xl font-bold">Continue your journey!</h1>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-300" />
              <span className="text-gray-500">OR</span>
              <div className="h-px flex-1 bg-gray-300" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center text-blue-500 hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
