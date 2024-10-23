import { generateClientAccessToken } from "@/utils/generateClientAccessToken";

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {clientInfo} = await req.json()
      
      const token=generateClientAccessToken({data:clientInfo}!,"2h")
      
      return Response.json({ data: token});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }