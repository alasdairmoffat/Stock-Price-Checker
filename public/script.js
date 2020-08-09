const stockPriceForm = document.querySelector('#stock-price-form');
const jsonResult = document.querySelector('#jsonResult');

function formatLikes(relLikes) {
  if (relLikes === 0) return '- <i></i>';

  return relLikes > 0
    ? `+${relLikes} <i class="fas fa-angle-up"></i>`
    : `${relLikes} <i class="fas fa-angle-down"></i>`;
}

function formatData(data) {
  const likesLine = data.likes
    ? `<i class="far fa-thumbs-up"></i>${data.likes}<i></i>`
    : `<i class="far fa-thumbs-up"></i> ${formatLikes(data.rel_likes)}`;

  return `<div class="stock-data">
            <h2 class="stock-name">${data.stock}</h2>
            <p class="price">
              $${data.price}
            </p>
            <p class="likes">
              ${likesLine}
            </p>
          </div>`;
}

function displayData(data) {
  if (typeof data === 'string');
  if (Array.isArray(data)) {
    jsonResult.innerHTML = `<div class="stock-grid">
                              ${formatData(data[0])}
                              ${formatData(data[1])}
                            </div>`;
  } else {
    jsonResult.innerHTML = `<div class="stock-flex">
                              ${formatData(data)}
                            </div>`;
  }
}

function displayError(data) {
  jsonResult.innerHTML = `<div class="error-message stock-flex">${data}</div>`;
}

stockPriceForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const stock1 = e.target.stock1.value;
  const stock2 = e.target.stock2.value;
  const like = e.target.like.checked;

  const params = [`stock=${stock1}`, `like=${like}`];

  if (stock2) {
    params.push(`stock=${stock2}`);
  }

  const res = await fetch(`/api/stock-prices?${params.join('&')}`);
  const data = await res.json();

  if (res.status === 200) {
    displayData(data.stockData ? data.stockData : data);
  } else {
    displayError(data);
  }
  stockPriceForm.reset();
});
