const demoArtworks=[
{id:"demo-1",title:"Quiet Geometry",artist:"Ama Mensah",category:"Painting",price:1850,currency:"USD",image:"https://images.unsplash.com/photo-1577083288073-40892c0860a4?auto=format&fit=crop&w=900&q=82",featured:true},
{id:"demo-2",title:"After Light",artist:"Daniel Okoro",category:"Photography",price:950,currency:"USD",image:"https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=82",featured:true},
{id:"demo-3",title:"Study in Ochre",artist:"Nana Kofi",category:"Print",price:420,currency:"USD",image:"https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=900&q=82",featured:false},
{id:"demo-4",title:"Blue Interior",artist:"Lina Ade",category:"Mixed Media",price:2400,currency:"USD",image:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=82",featured:true},
{id:"demo-5",title:"Soft Horizon",artist:"Kweku Addo",category:"Painting",price:1250,currency:"USD",image:"https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&w=900&q=82",featured:false},
{id:"demo-6",title:"Fragments of Light",artist:"Efua Sarpong",category:"Photography",price:780,currency:"USD",image:"https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=82",featured:true},
{id:"demo-7",title:"Earth Study",artist:"Kojo Nartey",category:"Mixed Media",price:1680,currency:"USD",image:"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=82",featured:false},
{id:"demo-8",title:"Night Composition",artist:"Akosua Boateng",category:"Painting",price:2150,currency:"USD",image:"https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=82",featured:true}
];

function money(a){return new Intl.NumberFormat(undefined,{style:"currency",currency:a.currency||"USD",maximumFractionDigits:2}).format(Number(a.price||0))}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",""":"&quot;","'":"&#039;"}[m]))}
function cart(){try{return JSON.parse(localStorage.getItem("zartz_cart")||"[]")}catch{return[]}}
function setCart(v){localStorage.setItem("zartz_cart",JSON.stringify(v));updateCartCount()}
function updateCartCount(){document.querySelectorAll("[data-cart-count]").forEach(e=>e.textContent=cart().length)}
function addCart(id){const a=demoArtworks.find(x=>x.id===id);if(!a)return;const c=cart();if(!c.some(x=>x.id===id)){c.push(a);setCart(c)}}

function card(a){
 return `<article class="apc-art-card">
   <a href="artwork.html?id=${encodeURIComponent(a.id)}" class="apc-art-link">
     <div class="apc-art-media">
       <img loading="lazy" src="${a.image}" alt="${escapeHtml(a.title)}">
       <div class="apc-card-cart"><button class="apc-cart-button" type="button" data-add="${a.id}">Add to Cart</button></div>
     </div>
     <div class="apc-art-info">
       <h3 class="apc-art-title">${escapeHtml(a.title)}</h3>
       <div class="apc-art-price">${money(a)}</div>
     </div>
   </a>
 </article>`
}

function renderHome(which="new"){
 const grid=document.querySelector("#home-grid"); if(!grid)return;
 const list=which==="featured"?demoArtworks.filter(a=>a.featured):demoArtworks.slice(0,4);
 grid.innerHTML=list.map(card).join("");
 grid.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",e=>{
   e.preventDefault();e.stopPropagation();addCart(b.dataset.add);b.textContent="Added";setTimeout(()=>b.textContent="Add to Cart",1000)
 }));
 const link=document.querySelector("[data-collection-link]");
 if(link)link.textContent=which==="featured"?"View Featured Works":"View New Arrivals";
}

document.addEventListener("DOMContentLoaded",()=>{
 updateCartCount();renderHome();
 document.querySelectorAll("[data-collection-tab]").forEach(t=>t.addEventListener("click",()=>{
   document.querySelectorAll("[data-collection-tab]").forEach(x=>{x.classList.remove("is-active");x.setAttribute("aria-selected","false")});
   t.classList.add("is-active");t.setAttribute("aria-selected","true");renderHome(t.dataset.collectionTab)
 }));
 document.querySelectorAll("[data-year]").forEach(e=>e.textContent=new Date().getFullYear())
});
window.demoArtworks=demoArtworks;