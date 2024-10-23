"use client"

function FullPageFormContainer({children}:{children:React.ReactNode}) {
    return ( 
    <main className="w-full min-h-screen bg-form grid place-items-center p-6">
       
      {children}
    </main>
     );
}

export default FullPageFormContainer;