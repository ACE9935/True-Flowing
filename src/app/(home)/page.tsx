import Logo from "@/components/Logo";
import { Insights, ShowChart } from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const InfosArticle = ({title,description,imgUrl,Icon}:{title:string,description:string,imgUrl:string,Icon:OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
}})=>{

  return(<div className="flex justify-center flex-wrap gap-8">
       <article className="flex flex-col gap-4 max-w-[34rem]">
        <div className="bg-gradient-to-r from-primary-blue-light to-primary-blue-dark text-white rounded-lg w-[3.3rem] h-[3.3rem] grid place-items-center"><Icon fontSize="large"/></div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div>{description}</div>
       </article>
       <img src={imgUrl} width={420} className="object-contain"/>
       </div>)
}

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
      <section className="bg-slate-300/30 px-6 py-12">
      <InfosArticle Icon={Insights} imgUrl="/screen-shots/ss1.png" title="Dynamic QR Code Generator with Real-Time Scan Tracking" description="With True Flowing’s dynamic QR code tool, you can create QR codes that track scan counts and allow you to update the linked URL anytime. Perfect for flexible campaigns, product updates, or events—gain insights in real-time and make adjustments without reprinting or resending codes."/>
    
      </section>
    </main>
  );
}
