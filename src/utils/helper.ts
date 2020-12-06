import { ICoupon } from "../interfaces";
import { config } from "./config";
import { cidRegex } from "./regex";
import { barcodeTemplate } from "./templates";

export function print(coupons: ICoupon[]) {
  const div = document.createElement("div");
  div.innerHTML = generateBarcodeHTML(coupons);
  document.body.appendChild(div);
}

export function generateBarcodeHTML(coupons: ICoupon[]) {
  let barcodeHTML = "";
  coupons.forEach((c) => {
    if(!c.id) {
        return;
    }
    const barcode = barcodeTemplate(c);
    barcodeHTML += barcode;
  });
  return barcodeHTML;
}

export function printDiv(div: HTMLDivElement) {
  var printContents = div.innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
}

export function isValidCoupon(coupon: ICoupon): boolean {
  if (!coupon) {
    return false;
  }

  if (!coupon.hash || coupon.hash.length < 17) {
    return false;
  }

  return true;
}

export async function fillCouponIds(coupons: ICoupon[]) {
  try {
    // Get the coupon ids from Cibus links
    coupons.forEach(async (c) => {
      const resp = await fetch(c.link);
      const text = await resp.text();
      c.id = text.match(cidRegex)?.[0] as string;
      c.barcode = `${config.baseUrl}/b/bar.ashx?${c.hash}`;
    });
  } catch (error) {
    throw error;
  }
}


export function printPage() {
  // Print
  window.print();
}

export const placeholder = ``;

