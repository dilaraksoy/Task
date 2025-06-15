(async () => {
  if (location.pathname !== "/") {
    console.log("wrong page");
    return;
  }

  const api = "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json";
  const st_key = "products";
  const favs_key = "favorites";


  const data = await (async () => {

    const cached = localStorage.getItem(st_key);

    if (cached) return JSON.parse(cached);

    const res = await fetch(api);
    const json = await res.json();

    localStorage.setItem(st_key, JSON.stringify(json));
    
    return json;
  })();

  const favs = JSON.parse(localStorage.getItem(favs_key)) || [];
  const target = document.querySelector(".banner__wrapper.ins-preview-wrapper-10167");
  if (!target) return;

  const container = document.createElement("div");
  container.className = "task-carousel";
  container.innerHTML = `
    <style>
      .task-carousel {
        margin: 32px 0;
        position: relative;
        font-family: 'Open Sans', sans-serif;
        margin-left: -40px;
        margin-right: -40px;
        padding: 0 40px;
      }
      .carousel-title {
        font-size: 24px;
        font-weight: bold;
        background-color:rgb(252, 246, 236);
        color:rgb(255, 141, 2);
        padding: 28px 66px;
        border-top-left-radius: 32px;
        border-top-right-radius: 32px;
      }
      .carousel-container {
        display: flex;
        position: relative;
        background-color:rgb(255, 255, 255);
        overflow: visible;
      }
      .carousel-scroll {
        display: flex;
        gap: 16px;
        scroll-behavior: smooth;
        padding: 20px 0;
        overflow-x: auto;
        scrollbar-width: none;
      }
      .carousel-scroll::-webkit-scrollbar {
        display: none;
      }
      .carousel-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 243px;
        background: rgb(255, 255, 255);
        border-radius: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        padding: 16px;
        position: relative;
        flex-shrink: 0;
        height: 520px;
        transition: border 0.3s ease;
      }
      .carousel-card:hover {
        border: 2px solid rgb(250, 147, 21);
      }
      .carousel-card img {
        width: 100%;
        height: 250px;
        object-fit: contain;
        border-radius: 10px;
      }
      .carousel-card .product-meta {
        font-size: 13px;
        color: rgb(122, 122, 122);
        margin: 10px 0 0;
        line-height: 1.4;
        word-break: break-word;
        min-height: 40px;
        flex-grow: 1;
      }
      .carousel-card .price-wrap {
        margin: 12px 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        min-height: 80px;
        gap: 4px;
      }
      .carousel-card .discounted-price {
        font-size: 20px;
        font-weight: bold;
        color:rgb(71, 173, 76);
      }
      .carousel-card .original-price {
        font-size: 20px;
        color: rgb(133, 133, 133);
        text-decoration: line-through;
        margin-right: 6px;
      }
      .carousel-card .no-discount-price {
        font-size: 20px;
        font-weight: bold;
        color: rgb(161, 161, 161);
      }
      .carousel-card .discount-rate {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 20px;
        font-weight: bold;
        color:rgb(93, 170, 112);
      }
      .carousel-card .discount-rate::after {
        content: "↓";
        display: inline-block;
        background-color:rgb(93, 170, 112);
        color: white;
        border-radius: 50%;
        padding: 4px 8px;
        font-size: 12px;
      }
      .carousel-card .add-to-cart {
        width: 100%;
        padding: 12px 12px;
        background: rgb(252, 246, 236);
        color:rgb(250, 147, 21);
        border: none;
        border-radius: 32px;
        font-weight: bold;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.3s, color 0.3s;
      }
      .carousel-card .add-to-cart:hover {
        background:rgb(250, 147, 21);
        color: rgb(255, 255, 255);
      }
      .carousel-card .heart {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 48px;
        height: 48px;
        background-color: rgb(255, 255, 255);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        cursor: pointer;
        user-select: none;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        color: rgb(218, 218, 218);
      }
      .carousel-card .heart.filled {
        color:rgb(250, 147, 21);
      }
      .swiper-prev, .swiper-next {
        position: absolute;
        background: rgb(252, 246, 236);
        border: 2px solid rgb(250, 147, 21);
        color:rgb(250, 147, 21);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 22px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
    </style>
    <h2 class="carousel-title">Beğenebileceğinizi Düşündüklerimiz</h2>
    <div class="carousel-container">
      <button class="swiper-prev"></button>
      <div class="carousel-scroll"></div>
      <button class="swiper-next"></button>
    </div>
  `;

  const scrollContainer = container.querySelector(".carousel-scroll");

  data.forEach(p => {
    const card = document.createElement("div");
    card.className = "carousel-card";
    card.setAttribute("data-id", p.id);
    card.setAttribute("data-url", p.url);

    const hasDsc = p.original_price > p.price;
    const dscRate = hasDsc ? Math.round(100-(p.price*100)/p.original_price) : 0;

    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <div class="product-meta"><strong>${p.brand}</strong> – ${p.name}</div>
      <div class="price-wrap">
        ${hasDsc
          ? `<div style="display:flex; gap:8px; align-items:center;">
               <span class="original-price">${p.original_price} TL</span>
               <span class="discount-rate">%${dscRate}</span>
             </div>
             <span class="discounted-price">${p.price} TL</span>`
          : `<span class="no-discount-price">${p.price} TL</span>`
        }
      </div>
      <button class="add-to-cart">Sepete Ekle</button>
      <div class="heart ${favs.includes(p.id) ? 'filled' : ''}">♥</div>
    `;
    scrollContainer.appendChild(card);
  });
  target.parentNode.insertBefore(container, target.nextSibling);
  container.addEventListener("click", (e) => {
    const heart = e.target.closest(".heart");
    const card = e.target.closest(".carousel-card");
    if (heart) {
      e.stopPropagation();
      const id = Number(card.dataset.id);
      let favs = JSON.parse(localStorage.getItem(favs_key))||[];
      if (favs.includes(id)) {
        favs = favs.filter(x=>x!==id);
        heart.classList.remove("filled");
      } else {
        favs.push(id);
        heart.classList.add("filled");
      }
      localStorage.setItem(favs_key, JSON.stringify(favs));
    }
    if (card && !heart && !e.target.matches(".add-to-cart")) {
      window.location.href = card.dataset.url;
    }
  });

  container.querySelector(".swiper-prev").onclick = () => {
    scrollContainer.scrollBy({ left: -260, behavior: "smooth" });
  };
  container.querySelector(".swiper-next").onclick = () => {
    scrollContainer.scrollBy({ left: 260, behavior: "smooth" });
  };
})();
