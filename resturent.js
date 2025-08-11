
    const restaurants = [
      {id:1,name:'Spice Villa',cuisine:'Indian',rating:4.5,time:30,priceForTwo:400,open:true,cover:'https://images.unsplash.com/photo-1604908177522-9b2a3b5bd6b1?auto=format&fit=crop&w=800&q=60',tags:['Biryani','Thali'] ,menu:[{id:'i1',name:'Chicken Biryani',price:220,img:'https://images.unsplash.com/photo-1604908177522-9b2a3b5bd6b1?auto=format&fit=crop&w=800&q=60'},{id:'i2',name:'Paneer Butter Masala',price:180,img:'https://images.unsplash.com/photo-1604908177522-9b2a3b5bd6b1?auto=format&fit=crop&w=800&q=60'}]},
      {id:2,name:'Dragon Wok',cuisine:'Chinese',rating:4.2,time:25,priceForTwo:300,open:false,cover:'https://images.unsplash.com/photo-1604908813929-1d3a2e3f1b6d?auto=format&fit=crop&w=800&q=60',tags:['Noodles','Szechuan'],menu:[{id:'c1',name:'Chow Mein',price:140,img:'https://images.unsplash.com/photo-1604908813929-1d3a2e3f1b6d?auto=format&fit=crop&w=800&q=60'},{id:'c2',name:'Manchurian',price:160,img:'https://images.unsplash.com/photo-1604908813929-1d3a2e3f1b6d?auto=format&fit=crop&w=800&q=60'}]},
      {id:3,name:'Bella Italia',cuisine:'Italian',rating:4.7,time:40,priceForTwo:700,open:true,cover:'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=60',tags:['Pasta','Pizza'],menu:[{id:'p1',name:'Margherita Pizza',price:420,img:'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=60'},{id:'p2',name:'Penne Alfredo',price:280,img:'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&w=800&q=60'}]},
      {id:4,name:'Burger Rush',cuisine:'Fast Food',rating:4.1,time:18,priceForTwo:250,open:true,cover:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=60',tags:['Burgers','Fries'],menu:[{id:'b1',name:'Classic Beef Burger',price:180,img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=60'},{id:'b2',name:'Fries',price:80,img:'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=60'}]}
    ];

    
    let state = {query:'',cuisine:'All',sort:'pop',openOnly:false,cart:{}};

    const restaurantGrid = document.getElementById('restaurantGrid');
    const topPicks = document.getElementById('topPicks');
    const searchInput = document.getElementById('search');
    const overlay = document.getElementById('overlay');
    const modalName = document.getElementById('modalName');
    const modalMeta = document.getElementById('modalMeta');
    const modalRate = document.getElementById('modalRate');
    const menuList = document.getElementById('menuList');
    const cartEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');

    
    function init(){
      // render UI
      renderRestaurants();
      renderTopPicks();
      bindFilters();
      loadCart();
    }

    function renderRestaurants(){
      const list = filteredAndSorted();
      restaurantGrid.innerHTML = '';
      if(list.length===0){
        restaurantGrid.innerHTML = `<div class=\"empty\">No restaurants match your search</div>`;
        return;
      }
      list.forEach(r=>{
        const div = document.createElement('div'); div.className='card';
        div.innerHTML = `
          <img src="${r.cover}" alt="${r.name}">
          <div style=\"display:flex;justify-content:space-between;align-items:center;margin-top:10px\">
            <div>
              <div style=\"font-weight:800\">${r.name}</div>
              <div class=\"muted\" style=\"font-size:13px;margin-top:6px\">${r.cuisine} • ₹${r.priceForTwo} for two • ${r.time} mins</div>
            </div>
            <div style=\"display:flex;flex-direction:column;align-items:flex-end;gap:6px\">
              <div class=\"rate\">${r.rating}</div>
              <button class=\"chip\" data-id=\"${r.id}\">View Menu</button>
            </div>
          </div>
        `;
        restaurantGrid.appendChild(div);
      });

     
      document.querySelectorAll('.chip[data-id]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          const id = +e.currentTarget.dataset.id;
          openMenu(id);
        });
      });
    }

    function renderTopPicks(){
      const top = restaurants.slice().sort((a,b)=>b.rating-a.rating).slice(0,3);
      topPicks.innerHTML='';
      top.forEach(r=>{
        const el = document.createElement('div'); el.className='restaurant';
        el.innerHTML = `<img src="${r.cover}" alt="${r.name}"><div class=\"r-info\"><div class=\"r-head\"><div class=\"r-name\">${r.name}</div><div class=\"rate\">${r.rating}</div></div><div class=\"meta\">${r.cuisine} • ${r.time} min</div><div class=\"r-tags\">${r.tags.map(t=>`<div class=\"tag\">${t}</div>`).join('')}</div></div>`;
        topPicks.appendChild(el);
      });
    }

    function filteredAndSorted(){
      let list = restaurants.filter(r=>{
        const q = state.query.trim().toLowerCase();
        if(state.cuisine!=='All' && r.cuisine!==state.cuisine) return false;
        if(state.openOnly && !r.open) return false;
        if(q){
          return r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q) || r.tags.join(' ').toLowerCase().includes(q);
        }
        return true;
      });
      if(state.sort==='rating') list.sort((a,b)=>b.rating-a.rating);
      else if(state.sort==='time') list.sort((a,b)=>a.time-b.time);
      else list.sort((a,b)=>b.rating-b.rating || a.time-b.time);
      return list;
    }

    searchInput.addEventListener('input',e=>{ state.query = e.target.value; renderRestaurants(); });
    document.getElementById('openNow').addEventListener('change',e=>{ state.openOnly = e.target.checked; renderRestaurants(); });

    function bindFilters(){
      document.querySelectorAll('.chip[data-cuisine]').forEach(c=>{
        c.addEventListener('click',e=>{ document.querySelectorAll('.chip[data-cuisine]').forEach(x=>x.style.opacity=0.8); e.currentTarget.style.opacity=1; state.cuisine = e.currentTarget.dataset.cuisine; renderRestaurants(); });
      });
      document.querySelectorAll('.chip[data-sort]').forEach(c=>{
        c.addEventListener('click',e=>{ document.querySelectorAll('.chip[data-sort]').forEach(x=>x.style.opacity=0.8); e.currentTarget.style.opacity=1; state.sort = e.currentTarget.dataset.sort; renderRestaurants(); });
      });

      document.getElementById('nearbyBtn').addEventListener('click',()=>{ alert('Demo: Geolocation would be used here in a real app.'); });
      document.getElementById('applyLocation').addEventListener('click',()=>{ alert('Location applied: ' + document.getElementById('location').value); });
    }

    function openMenu(restId){
      const r = restaurants.find(x=>x.id===restId);
      if(!r) return;
      modalName.textContent = r.name;
      modalMeta.textContent = `${r.cuisine} • ₹${r.priceForTwo} for two • ${r.time} mins`;
      modalRate.textContent = r.rating;
      menuList.innerHTML = '';
      r.menu.forEach(d=>{
        const di = document.createElement('div'); di.className='dish';
        di.innerHTML = `<div class=\"d-left\"><img src=\"${d.img}\" alt=\"${d.name}\"><div><div style=\"font-weight:700\">${d.name}</div><div class=\"muted\">₹${d.price}</div></div></div><div style=\"display:flex;flex-direction:column;gap:8px;align-items:flex-end\"><div class=\"muted\">${r.name}</div><div class=\"qty\"><button data-add=\"${r.id}::${d.id}\">+</button></div></div>`;
        menuList.appendChild(di);
      });
     
      menuList.querySelectorAll('button[data-add]').forEach(btn=>{
        btn.addEventListener('click',e=>{
          const [rid,did] = e.currentTarget.dataset.add.split('::');
          addToCart(+rid,did);
        });
      });

      overlay.style.display='flex';
    }
    document.getElementById('closeModal').addEventListener('click',()=>overlay.style.display='none');
    document.getElementById('overlay').addEventListener('click',e=>{ if(e.target===overlay) overlay.style.display='none' });

  
    function loadCart(){
      const raw = localStorage.getItem('foodie_cart');
      state.cart = raw ? JSON.parse(raw) : {};
      renderCart();
    }
    function saveCart(){ localStorage.setItem('foodie_cart', JSON.stringify(state.cart)); renderCart(); }

    function addToCart(restaurantId, dishId){
      const rest = restaurants.find(r=>r.id===restaurantId);
      const dish = rest.menu.find(m=>m.id===dishId);
      const key = `${restaurantId}::${dishId}`;
      if(!state.cart[key]) state.cart[key] = {restaurantId, dishId, qty:0, name:dish.name, price:dish.price};
      state.cart[key].qty += 1;
      saveCart();
      alert(`${dish.name} added to cart`);
    }

    function renderCart(){
      cartEl.innerHTML = '';
      const keys = Object.keys(state.cart);
      if(keys.length===0){ cartEl.innerHTML = '<div class="muted">Your cart is empty</div>'; cartTotalEl.textContent = '₹0'; return; }
      let total = 0;
      keys.forEach(k=>{
        const it = state.cart[k]; total += it.qty * it.price;
        const row = document.createElement('div'); row.className='cart-item';
        row.innerHTML = `<div><div style=\"font-weight:700\">${it.name}</div><div class=\"muted\">₹${it.price} x ${it.qty}</div></div><div style=\"display:flex;flex-direction:column;gap:6px;align-items:flex-end\"><div style=\"font-weight:700\">₹${it.price*it.qty}</div><div style=\"display:flex;gap:6px\"><button data-dec=\"${k}\">-</button><button data-inc=\"${k}\">+</button></div></div>`;
        cartEl.appendChild(row);
      });
      cartTotalEl.textContent = `₹${total}`;

     
      cartEl.querySelectorAll('button[data-inc]').forEach(b=>b.addEventListener('click',e=>{ const k=e.currentTarget.dataset.inc; state.cart[k].qty+=1; saveCart(); }));
      cartEl.querySelectorAll('button[data-dec]').forEach(b=>b.addEventListener('click',e=>{ const k=e.currentTarget.dataset.dec; state.cart[k].qty-=1; if(state.cart[k].qty<=0) delete state.cart[k]; saveCart(); }));
    }

    document.getElementById('clearCart').addEventListener('click',()=>{ state.cart={}; saveCart(); });
    document.getElementById('checkoutBtn').addEventListener('click',()=>placeOrder());

    function placeOrder(){
      const items = Object.values(state.cart);
      if(items.length===0){ alert('Your cart is empty. Add items before checkout.'); return; }
      
      const total = items.reduce((s,i)=>s + i.qty*i.price,0);
      const payload = {items, total, orderedAt: new Date().toISOString()};
      // in a real app you'd POST this to server
      alert('Order placed successfully! Total: ₹' + total);
      state.cart = {};
      saveCart();
    }
    init();