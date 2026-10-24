if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(registrations=>{
 const rootScope=new URL('/',location.origin).href;
 if(registrations.some(reg=>reg.scope===rootScope))navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});
}).catch(()=>{});}
