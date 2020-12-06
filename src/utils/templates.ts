import { ICoupon } from "../interfaces";
import { NIS } from "./regex";

export function couponItemTemplate(c: ICoupon) {
    return `<li class="list-group-item pr-5 ${c.used?'used':''}">
    <div class="form-check form-check-inline check-coupon">
        <input class="form-check-input" type="checkbox" id="${c.hash}" ${c.used?'checked':''}>
    </div>
    <svg data-id="${c.hash}" width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-x delete-coupon" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">קופון ${NIS}${c.price} ${c.brand ? c.brand : ''}<br>
            <span class="coupon-id">
                ${c.id ? `<a target="_blank" href="${c.link}">${c.id}</a>` : ''}
            </span>
        </h5>

        <small>${c.expire ? `תוקף ${c.expire}` : ''}</small>
      </div>
      <small>(עודכן בתאריך ${c.date} בשעה ${c.time})</small>
    </li>`
}

export function barcodeTemplate(c: ICoupon) {
    return `
    <div class="barcode">
        <div class="c-id">${c.id}    (${NIS}${c.price})</div>
        <div class="img">
            <img  alt="${c.id}" src="${c.barcode}">
        </div>
    </div>`;
}