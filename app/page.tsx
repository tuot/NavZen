import { SearchBox } from "@/components/SearchBox";

export default function Page() {
  return (
    <div className="relative size-full min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Light mode blobs */}
      <div className="absolute inset-0 dark:hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-200/60 blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-purple-200/60 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-5%] left-[20%] w-[35%] h-[35%] rounded-full bg-pink-200/50 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-[50%] left-[50%] w-[30%] h-[30%] rounded-full bg-amber-100/40 blur-3xl animate-blob animation-delay-3000" />
      </div>
      {/* Dark mode blobs */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-900/30 blur-3xl animate-blob" />
        <div className="absolute top-[15%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-900/25 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[15%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-3xl animate-blob animation-delay-4000" />
        <div className="absolute top-[45%] left-[45%] w-[35%] h-[35%] rounded-full bg-fuchsia-900/15 blur-3xl animate-blob animation-delay-3000" />
      </div>
      <div className="relative z-10">
        <SearchBox />
      </div>
    </div>
  );
}
