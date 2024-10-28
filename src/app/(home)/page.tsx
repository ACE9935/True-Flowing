import Logo from "@/components/Logo";
import { Casino, Insights, Notifications, ShowChart } from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const InfosArticle = ({reverseContent,title,description,imgUrl,Icon}:{reverseContent?:boolean,title:string,description:string,imgUrl:string,Icon:OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
  muiName: string;
}})=>{

  return(<div className={`${reverseContent&&"flex-row-reverse"} flex justify-center flex-wrap gap-8`}>
       <article className="flex flex-col gap-4 max-w-[34rem]">
        <div className="bg-gradient-to-r from-primary-blue-light to-primary-blue-dark text-white rounded-lg w-[3.3rem] h-[3.3rem] grid place-items-center"><Icon fontSize="large"/></div>
        <h1 className="text-2xl font-bold text-primary-color">{title}</h1>
        <div>{description}</div>
       </article>
       <img src={imgUrl} width={450} className="object-contain"/>
       </div>)
}

export default function Home() {
  
  return (
    <main className='w-full min-h-screen'>
      <nav className="pt-4 pb-1 px-6 flex justify-between items-center">
        <div className="text-xs sm:text-md"><Logo variation="light"/></div>
        <button className="bg-gradient-to-r from-primary-blue-light hover:bg-black/20 bg-blend-overlay to-primary-blue-dark transition-all rounded-lg text-white py-3 font-semibold px-6">Sign in</button>
      </nav>
      <section className="sm:p-6 pt-6">
        <div style={{backgroundImage:"url('/hero.jpg')"}} className="sm:rounded-xl flex flex-col gap-8 items-center py-32 bg-cover bg-center bg-primary-blue-dark bg-blend-multiply">
         <h1 className="font-bold text-center text-3xl md:text-5xl text-white flex flex-col gap-4">
          <div>Unlock Free, Tailored Marketing Strategies</div>
           <div className="text-primary-blue-light">To Drive Enterprise Successs</div>
          </h1>
          <div className="font-semibold text-primary-blue-extra-light text-lg">For all kind of businesses</div>
          <button className="bg-white hover:bg-primary-blue-extra-light transition-all rounded-lg text-primary-blue-dark py-4 font-semibold px-7">Get started!</button>
        </div>
      </section>
      <section className="bg-slate-300/30 px-6 py-12 flex flex-col gap-14">
      <h1 className="text-4xl pb-8 font-bold text-center">True Flowing’s Features</h1>
      <InfosArticle Icon={Insights} imgUrl="/screen-shots/ssone.png" title="Dynamic QR Code Generator with Real-Time Scan Tracking" description="With True Flowing’s dynamic QR code tool, you can create QR codes that track scan counts and allow you to update the linked URL anytime. Perfect for flexible campaigns, product updates, or events—gain insights in real-time and make adjustments without reprinting or resending codes."/>
      <InfosArticle reverseContent Icon={Casino} imgUrl="/screen-shots/ss-234.png" title="Premium QR Codes: Boost Engagement with Prize Roulette and Reviews" description="True Flowing’s Premium QR Codes feature lets businesses create engaging, custom QR codes that boost client interaction and feedback. When customers scan a Premium QR Code, they’re directed to a prize roulette game where they can enter their information and leave a review for the establishment. This fun, interactive approach not only offers clients a chance to win but also helps establishments gather valuable contact information and genuine reviews, enhancing customer engagement while building a loyal audience."/>
      <InfosArticle Icon={Notifications} imgUrl="/screen-shots/ss56.png" title="True Flowing’s Notification System: Engage Clients with Targeted Campaigns" description="True Flowing’s Notification System allows businesses to send personalized emails and SMS notifications directly to clients registered through Premium QR Codes. By leveraging contacts gathered through these interactive codes, establishments can easily create and manage targeted notification campaigns to keep clients informed about special offers, events, or updates. This feature empowers businesses to build lasting client relationships, transforming every interaction into an opportunity for engagement and loyalty."/>
      </section>
    </main>
  );
}
