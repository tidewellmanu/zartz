export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success:false, message:'Method not allowed' });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(500).json({ success:false, message:'PAYSTACK_SECRET_KEY is not configured.' });
  try {
    const { email, amount, currency='GHS', items=[] } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({success:false,message:'A valid email address is required.'});
    if (!Number.isInteger(amount) || amount <= 0) return res.status(400).json({success:false,message:'A valid payment amount is required.'});
    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const response = await fetch('https://api.paystack.co/transaction/initialize',{
      method:'POST',
      headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},
      body:JSON.stringify({email,amount:String(amount),currency,callback_url:`${origin}/?payment=return`,metadata:JSON.stringify({source:'zartz',items:Array.isArray(items)?items.slice(0,50):[]})})
    });
    const data=await response.json();
    if(!response.ok || !data.status) return res.status(response.status || 502).json({success:false,message:data.message || 'Paystack transaction initialization failed.'});
    return res.status(200).json({success:true,authorization_url:data.data.authorization_url,access_code:data.data.access_code,reference:data.data.reference});
  } catch(error) { return res.status(500).json({success:false,message:error.message || 'Payment initialization failed.'}); }
}