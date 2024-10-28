import Logo from "@/components/Logo";

export default function Home() {
  
  return (
    <main className='w-full min-h-screen'>
      <nav className="pt-4 pb-1 px-6 flex justify-between items-center">
        <Logo variation="light"/>
        <button className="bg-gradient-to-r from-primary-blue-light hover:bg-black/20 bg-blend-overlay to-primary-blue-dark transition-all rounded-lg text-white py-3 font-semibold px-6">Sign in</button>
      </nav>
      <section className="p-6">
        <div style={{backgroundImage:"url('/hero.jpg')"}} className="rounded-xl flex flex-col gap-8 items-center py-32 bg-cover bg-center bg-primary-blue-dark bg-blend-multiply">
         <h1 className="font-bold text-center text-5xl text-white flex flex-col gap-4">
          <div>Unlock Free, Tailored Marketing Strategies</div>
           <div className="text-primary-blue-light">To Drive Enterprise Successs</div>
          </h1>
          <div className="font-semibold text-primary-blue-extra-light text-lg">For all kind of businesses</div>
          <button className="bg-white hover:bg-primary-blue-extra-light transition-all rounded-lg text-primary-blue-dark py-4 font-semibold px-7">Get started!</button>
        </div>
      </section>
    </main>
  );
}
