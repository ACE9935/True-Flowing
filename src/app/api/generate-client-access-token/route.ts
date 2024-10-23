import { generateClientAccessToken } from "@/utils/generateClientAccessToken";

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {data} = await req.json()
      const token=generateClientAccessToken({...data})
      
      return Response.json({ data: token});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }