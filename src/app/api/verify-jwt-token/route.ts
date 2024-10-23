import jwt from 'jsonwebtoken'

export async function POST(req: Request): Promise<Response> {
    try {
      
      const {token} = await req.json()
      
      const decodedToken:any = jwt.verify(token!, process.env.JWT_SECRET!);
      return Response.json({ data: decodedToken,status:"OK"});
    } catch (error: unknown) {
      console.error({ error });
      return Response.json({ error });
    }
  }