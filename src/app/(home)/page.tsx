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

const BenefitsCard = ({rate,description}:{rate:string,description:string})=>{

  return(<div className="flex flex-col gap-2 border-2 items-center rounded-lg p-4 grow">
    <div className="text-primary-blue text-3xl font-bold">{rate}</div>
    <h2 className="font-semibold text-slate-600">{description}</h2>
  </div>)
}

export default function Home() {
  
  return (
    <main className='w-full min-h-screen'>
      <nav className="pt-4 pb-1 px-6 flex justify-between items-center">
        <div className="text-xs sm:text-md"><Logo variation="light"/></div>
        <a href="/login" className="bg-gradient-to-r from-primary-blue-light hover:bg-black/20 bg-blend-overlay to-primary-blue-dark transition-all rounded-lg text-white py-3 font-semibold px-6">Sign in</a>
      </nav>
      <section className="sm:p-6 pt-6">
        <div style={{backgroundImage:"url('/hero.jpg')"}} className="sm:rounded-xl flex flex-col gap-8 items-center py-32 bg-cover bg-center bg-primary-blue-dark bg-blend-multiply">
         <h1 className="font-bold text-center text-3xl md:text-5xl text-white flex flex-col gap-4">
          <div>Unlock Free, Tailored Marketing Strategies</div>
           <div className="text-primary-blue-light">To Drive Enterprise Successs</div>
          </h1>
          <div className="font-semibold text-primary-blue-extra-light text-lg">For all kind of businesses</div>
          <a href="/dashboard" className="bg-white hover:bg-primary-blue-extra-light transition-all rounded-lg text-primary-blue-dark py-4 font-semibold px-7">Get started!</a>
        </div>
      </section>
      <section className="bg-slate-300/30 px-6 py-12 flex flex-col gap-14">
      <h1 className="text-4xl pb-8 font-bold text-center">True Flowing’s Features</h1>
      <InfosArticle Icon={Insights} imgUrl="/screen-shots/ssone.png" title="Dynamic QR Code Generator with Real-Time Scan Tracking" description="With True Flowing’s dynamic QR code tool, you can create QR codes that track scan counts and allow you to update the linked URL anytime. Perfect for flexible campaigns, product updates, or events—gain insights in real-time and make adjustments without reprinting or resending codes."/>
      <InfosArticle reverseContent Icon={Casino} imgUrl="/screen-shots/ss-234.png" title="Premium QR Codes: Boost Engagement with Prize Roulette and Reviews" description="True Flowing’s Premium QR Codes let businesses create custom, engaging QR codes that boost client interaction. When scanned, customers are directed to a prize roulette game where they can enter their information and leave a review, adding an element of fun while helping establishments gather genuine feedback. Additionally, collected contact information can be exported as an Excel file, making it easy for businesses to organize and use the data for personalized marketing, customer follow-ups, or targeted promotions. This interactive approach not only enhances customer engagement but also builds loyalty and maximizes the value of each interaction."/>
      <InfosArticle Icon={Notifications} imgUrl="/screen-shots/ss56.png" title="True Flowing’s Notification System: Engage Clients with Targeted Campaigns" description="
True Flowing’s Notification System lets businesses send personalized emails and SMS notifications to clients registered through Premium QR Codes. By using contacts gathered through these QR codes, establishments can create targeted campaigns to keep clients informed of special offers, events, or updates—turning each interaction into an opportunity to build engagement and loyalty."/>
      </section>
      <section className="px-6 py-12 flex flex-col gap-14 items-center">
      <h1 className="text-4xl font-bold text-center">True Flowing’s Benefits</h1>
      <article className="flex justify-center gap-6 flex-wrap max-w-[800px] w-full" >
        <BenefitsCard rate="+60%" description="Reviews Increase"/>
        <BenefitsCard rate="+30%" description="Visits Increase"/>
        <BenefitsCard rate="+60%" description="Customer Satisfaction"/>
      </article>
      </section>
      <footer className="p-6 bg-slate-300/30 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl"><div>For colaboration</div> <div className="text-primary-blue">Feel free to conact me</div></h1>
        <div className="underline text-primary-blue">anaselmouden99@gmail.com</div>
        </div>
      <div className="flex justify-between flex-wrap gap-2">
      <p className="">© 2024 True Flowing, all rights reserved</p>
      <div>Made by <a href="https://anas-elmouden-portfolio.vercel.app/" className="underline text-primary-blue">Anas El Mouden</a></div>
      </div>
      </footer>
    </main>
  );
}
