
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-gray-100 dark:bg-gray-900">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-white shadow-2xl">
       
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
            
            <div className="space-y-1 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                    Sign Up
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Start your journey now!
                </p>
                <div className="space-y-5">
                <SignUpForm />
                <Link href="/login" className="block text-center hover:underline">
                     Already have an account? Log in
                </Link>
          </div>
            </div>
        </div>
        <Image
            src="/machapuchrevector.jpg"
            alt="Signup Image"
            width={500}
            height={500}
            className="hidden w-1/2 object-cover md:block "
          />
   
        </div>
    </main>
  );
}
