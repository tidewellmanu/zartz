export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({success:false,message:'Method not allowed'});
  const secret=process.env.PAYSTACK_SECRET_KEY;
  if(!secret) return res.status(500).json({success:false,message:'PAYSTACK_SECRET_KEY is not configured.'});
  const reference=String(req.query.reference || '');
  if(!reference || !/^[A-Za-z0-9.=\-_]+$/.test(reference)) return res.status(400).json({success:false,message:'Invalid transaction reference.'});
  try {
    const response=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,{headers:{Authorization:`Bearer ${secret}`}});
    const data=await response.json();
    if(!response.ok || !data.status) return res.status(response.status || 502).json({success:false,message:data.message || 'Paystack verification failed.'});
    return res.status(200).json({success:true,status:data.data?.status || 'unknown',reference:data.data?.reference || reference,amount:data.data?.amount,currency:data.data?.currency});
  } catch(error) { return res.status(500).json({success:false,message:error.message || 'Payment verification failed.'}); }
}