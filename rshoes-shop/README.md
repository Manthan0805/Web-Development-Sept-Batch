# RSHOES

A responsive, multi-page sneaker storefront built with HTML, CSS, and vanilla JavaScript.

## Run the site

Open `index.html` in a browser, or serve the `rshoes-shop` folder with a local static server. From the repository root, for example:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000/rshoes-shop/`.

## Pages

- `index.html` — Home page and featured products
- `shoes.html` — Product catalog with category filters, search, sorting, sizes, and show more
- `about.html` — About the shop
- `contact.html` — Contact form

## Store features

- Responsive layout with a sticky header and page navigation
- Product photos, categories, prices, and available UK sizes
- Product search, category filters, and price/name sorting
- Add-to-bag controls, quantity changes, and a persistent browser-local shopping bag
- Demo sign-in and address collection at checkout
- Accessible labels, validation, dialog controls, and status messages

## Demo limitations

The products, delivery information, and all prices are sample content. The contact form does not send email. Sign-in is saved only in the local browser and does not create an account. Checkout displays a demo confirmation; it does not charge a payment method, send an order, or arrange delivery. Product images and web fonts require an internet connection.

Before accepting real orders, connect the storefront to a secure backend, inventory source, account provider, payment processor, fulfillment service, and live contact channel. Do not collect real customer or payment data through this front-end demo.
