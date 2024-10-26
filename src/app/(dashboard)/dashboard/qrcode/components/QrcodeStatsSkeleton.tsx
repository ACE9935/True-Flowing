import { Skeleton } from "@mui/material";

function QrcodeStatsSkeleton() {
    return ( 
    <div className="flex flex-col gap-5 p-6 w-full">
        <div className="flex flex-col gap-3">
        <Skeleton variant="rounded" height={50} width={"80%"}/>
        <Skeleton variant="rounded" height={30} width={"50%"}/>
        </div>
    <div className="lg:flex-row flex-col flex gap-5">
    <Skeleton variant="rounded" height={300} width={300} />
    <div className="flex flex-col gap-5 grow">
        <Skeleton variant="rounded" height={400} />
        <Skeleton variant="rounded" height={100} />
    </div>
    </div>
    </div>
     );
}

export default QrcodeStatsSkeleton;