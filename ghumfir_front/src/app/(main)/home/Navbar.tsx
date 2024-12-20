import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import Image from "next/image";
export default function Navbar() {
   return (
     <header className="sticky top-0 z-10 bg-card shadow-sm">
       <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3">
         {/* Brand Name */}
         <Image 
             src="/favicon.ico" 
             alt="Ghumfir Logo" 
             width={40} 
             height={40} 
             className="rounded-full"
           />
         <Link href="/" className="text-2xl font-bold text-primary">
           Ghumfir
         </Link>
 
         {/* Search Field */}
         <SearchField  />
 
         {/* User Button */}
         <UserButton className="sm:ms-auto" />
       </div>
     </header>
   );
 }
 