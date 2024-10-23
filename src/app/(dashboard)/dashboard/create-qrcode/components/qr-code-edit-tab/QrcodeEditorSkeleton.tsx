import { Skeleton } from "@mui/material";

function QrCodeEditorSkeleton() {
    return ( 
        <div className="flex flex-col gap-5">
        <Skeleton variant="rounded" height={100} />
        <Skeleton variant="rounded" height={150} />
        <Skeleton variant="rounded" height={200} />
        </div>
     );
}

export default QrCodeEditorSkeleton;