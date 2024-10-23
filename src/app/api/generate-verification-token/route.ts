import { generateVerificationToken } from "@/utils/generateVerificationToken";

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {email} = await req.json()
      
      const token=generateVerificationToken(email!)
      return Response.json({ data: token});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }