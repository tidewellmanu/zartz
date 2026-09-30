export default async function handler(req,res){
  if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret) return res.status(500).json({error:"PAYSTACK_SECRET_KEY is not configured on Vercel"});
  try{
    const body=req.body||{};
    const email=String(body.email||"").trim();
    const total=Number(body.total||0);
    const currency=String(body.currency||"USD").toUpperCase();
    if(!email||!Number.isFinite(total)||total<=0) return res.status(400).json({error:"Valid email and order total are required"});
    const amount=Math.round(total*100);
    const origin=process.env.SITE_URL || ((req.headers["x-forwarded-proto"]||"https")+"://"+req.headers.host);
    const response=await fetch("https://api.paystack.co/transaction/initialize",{method:"POST",headers:{"Authorization":"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({email,amount,currency,callback_url:origin+"/payment-success.html",metadata:{customer_name:body.name,phone:body.phone,country:body.country,address:body.address,items:body.items||[]}})});
    const data=await response.json();
    if(!response.ok||!data.status) return res.status(400).json({error:data.message||"Paystack initialization failed"});
    return res.status(200).json({authorization_url:data.data.authorization_url,reference:data.data.reference});
  }catch(e){return res.status(500).json({error:"Payment initialization failed"});}
}