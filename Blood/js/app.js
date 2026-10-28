// BloodConnect front-end demo: records are saved only in this browser's localStorage.
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DEMO_DONORS = [
  {id:1,name:"Aarav Sharma",group:"O+",city:"Greater Noida",phone:"9000000001",available:true},
  {id:2,name:"Ananya Singh",group:"A+",city:"Noida",phone:"9000000002",available:true},
  {id:3,name:"Rohan Verma",group:"B+",city:"Greater Noida",phone:"9000000003",available:true},
  {id:4,name:"Priya Gupta",group:"O-",city:"Delhi",phone:"9000000004",available:true},
  {id:5,name:"Kabir Kumar",group:"AB+",city:"Ghaziabad",phone:"9000000005",available:true},
  {id:6,name:"Meera Patel",group:"A-",city:"Greater Noida",phone:"9000000006",available:true},
  {id:7,name:"Ishaan Das",group:"B-",city:"Noida",phone:"9000000007",available:true},
  {id:8,name:"Sara Khan",group:"AB-",city:"Delhi",phone:"9000000008",available:true},
  {id:9,name:"Dev Mishra",group:"O+",city:"Ghaziabad",phone:"9000000009",available:true}
];
const STORAGE = {donors:"bc_demo_donors",requests:"bc_demo_requests",users:"bc_demo_users",current:"bc_demo_current_user"};
function readStore(key, fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch(e){return fallback}}
function writeStore(key,value){localStorage.setItem(key,JSON.stringify(value))}
function donors(){return readStore(STORAGE.donors,DEMO_DONORS)}
function requests(){return readStore(STORAGE.requests,[])}
function escapeHtml(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function setMessage(el,text,type="success"){if(!el)return;el.textContent=text;el.className="form-message "+type}
document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.querySelector("[data-menu-toggle]"),nav=document.querySelector("[data-nav]");
  if(toggle&&nav)toggle.addEventListener("click",()=>nav.classList.toggle("open"));
  const quick=document.getElementById("quickSearch");
  if(quick)quick.addEventListener("submit",e=>{e.preventDefault();const g=document.getElementById("quickGroup").value;const city=document.getElementById("quickLocation").value.trim();location.href=`donors.html?group=${encodeURIComponent(g)}&city=${encodeURIComponent(city)}`});
  const requestForm=document.getElementById("requestForm");
  if(requestForm)requestForm.addEventListener("submit",e=>{
    e.preventDefault();if(!requestForm.reportValidity())return;
    const form=new FormData(requestForm),list=requests();
    const item={id:Date.now(),patientName:form.get("patientName").trim(),group:form.get("bloodGroup"),units:Number(form.get("units")),urgency:form.get("urgency"),hospital:form.get("hospital").trim(),city:form.get("city").trim(),phone:form.get("phone").trim(),notes:form.get("notes").trim(),status:"Pending",createdAt:new Date().toISOString()};
    list.unshift(item);writeStore(STORAGE.requests,list);
    setMessage(document.getElementById("requestMessage"),"Demo request saved successfully in this browser. For a real emergency, contact a hospital or blood bank directly.");
    requestForm.reset();
  });
  const searchForm=document.getElementById("donorSearch");
  if(searchForm){const params=new URLSearchParams(location.search);document.getElementById("searchGroup").value=params.get("group")||"";document.getElementById("searchCity").value=params.get("city")||"";const render=()=>renderDonors();searchForm.addEventListener("submit",e=>{e.preventDefault();render()});render();}
  const register=document.getElementById("registerForm");
  if(register)register.addEventListener("submit",e=>{
    e.preventDefault();if(!register.reportValidity())return;
    const name=document.getElementById("regName").value.trim(),email=document.getElementById("regEmail").value.trim().toLowerCase(),password=document.getElementById("regPassword").value,group=document.getElementById("regGroup").value,city=document.getElementById("regCity").value.trim(),phone=document.getElementById("regPhone").value.trim();
    const users=readStore(STORAGE.users,[]);if(users.some(u=>u.email===email)){setMessage(document.getElementById("registerMessage"),"An account with this email already exists in this browser.","error");return}
    // Demo only: never store real passwords in a production application this way.
    users.push({name,email,password,group,city,phone});writeStore(STORAGE.users,users);
    const all=donors();all.push({id:Date.now(),name,group,city,phone,available:true});writeStore(STORAGE.donors,all);
    setMessage(document.getElementById("registerMessage"),"Demo profile created. You can now try the login form.");register.reset();
  });
  const login=document.getElementById("loginForm");
  if(login)login.addEventListener("submit",e=>{e.preventDefault();const email=document.getElementById("loginEmail").value.trim().toLowerCase(),password=document.getElementById("loginPassword").value;const user=readStore(STORAGE.users,[]).find(u=>u.email===email&&u.password===password);if(!user){setMessage(document.getElementById("loginMessage"),"Demo account not found. Register first on this browser.","error");return}writeStore(STORAGE.current,{name:user.name,email:user.email});setMessage(document.getElementById("loginMessage"),`Welcome, ${user.name}! This is a local demo login.`);});
  if(document.getElementById("requestRows"))renderAdmin();
  const clear=document.getElementById("clearDemo");if(clear)clear.addEventListener("click",()=>{if(confirm("Remove all demo blood requests saved in this browser?")){writeStore(STORAGE.requests,[]);renderAdmin()}});
});
function renderDonors(){
 const container=document.getElementById("donorResults");if(!container)return;
 const group=document.getElementById("searchGroup").value,city=document.getElementById("searchCity").value.trim().toLowerCase();
 const filtered=donors().filter(d=>(!group||d.group===group)&&(!city||d.city.toLowerCase().includes(city)));
 document.getElementById("donorCount").textContent=`${filtered.length} donor${filtered.length===1?"":"s"}`;
 container.innerHTML=filtered.length?filtered.map(d=>`<article class="donor-card"><div class="donor-top"><div class="blood-badge">${escapeHtml(d.group)}</div><div><h3>${escapeHtml(d.name)}</h3><p>Registered demo donor</p></div></div><div class="donor-meta">⌖ &nbsp;${escapeHtml(d.city)}<br>☎ &nbsp;${escapeHtml(d.phone)}<br><span class="status Approved">Sample record</span></div></article>`).join(""):`<div class="feature-card"><h3>No matching donors</h3><p>Try another blood group or city.</p></div>`;
}
function renderAdmin(){
 const list=requests(),tbody=document.getElementById("requestRows");
 document.getElementById("statTotal").textContent=list.length;
 document.getElementById("statDonors").textContent=donors().length;
 document.getElementById("statPending").textContent=list.filter(r=>r.status==="Pending").length;
 document.getElementById("statFulfilled").textContent=list.filter(r=>r.status==="Fulfilled").length;
 document.getElementById("adminEmpty").textContent=list.length?"These are local demo records. Status updates remain in this browser.":"No requests have been submitted yet. Submit a request on the Emergency Request page to see it here.";
 tbody.innerHTML=list.map(r=>`<tr><td>#REQ-${String(r.id).slice(-5)}</td><td>${escapeHtml(r.patientName)}</td><td><strong>${escapeHtml(r.group)}</strong></td><td>${escapeHtml(r.city)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.urgency)}</td><td><span class="status ${escapeHtml(r.status)}">${escapeHtml(r.status)}</span></td><td><div class="table-actions"><button class="approve" data-id="${r.id}" data-status="Approved">Approve</button><button class="approve" data-id="${r.id}" data-status="Fulfilled">Fulfilled</button><button class="reject" data-id="${r.id}" data-status="Rejected">Reject</button></div></td></tr>`).join("");
 tbody.querySelectorAll("button[data-id]").forEach(btn=>btn.addEventListener("click",()=>{const next=list.map(r=>String(r.id)===btn.dataset.id?{...r,status:btn.dataset.status}:r);writeStore(STORAGE.requests,next);renderAdmin()}));
}
