export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).end();
  const crypto = await import("node:crypto");
  const secret=process.env.PAYSTACK_SECRET_KEY;
  const signature=req.headers["x-paystack-signature"];
  const raw=typeof req.body==="string"?req.body:JSON.stringify(req.body||{});
  if(!secret||!signature)return res.status(401).end();
  const hash=crypto.createHmac("sha512",secret).update(raw).digest("hex");
  if(hash!==signature)return res.status(401).end();
  return res.status(200).json({received:true});
}