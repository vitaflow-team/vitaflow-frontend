export default function Settings() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full bg-[url('/backgroundLogo.svg')] items-center justify-center bg-cover bg-no-repeat bg-right gap-20">
        <div className="flex flex-col gap-6 p-4 md:p-10 md:py-16">
          <span className="w-full font-bold text-4xl md:text-3xl lg:text-5xl 2xl:text-7xl">
            Settings
          </span>
        </div>
      </div>
    </div>
  );
}
