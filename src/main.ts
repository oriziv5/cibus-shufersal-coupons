import "./styles.scss";
import {
  captureImportRegex,
  captureRegex,
  importMessageRegex,
  NIS,
  shufesalMessageRegex,
} from "./utils/regex";
import { generateBarcodeHTML, printPage } from "./utils/helper";
import { Coupon } from "./coupon";
import {
  body,
  couponsAlert,
  couponsCheckButton,
  exportButton,
  homeTab,
  myCouponsContainer,
  myCouponsTab,
  noCoupons,
  printButton,
  printContainer,
  printTab,
  textArea,
  textForm,
  totalWorth,
  whatsAppLink,
} from "./elements";
import { UserStorage } from "./utils/db";
import { ICoupon } from "./interfaces";
import { couponItemTemplate } from "./utils/templates";
import { config } from "./utils/config";

const coupons: Coupon[] = [];
let myCoupons: ICoupon[] = [];
const db = new UserStorage();

function main() {
  // Show the app
  body.show();

  // Listen to click event
  couponsCheckButton?.on("click", getCoupons);
  printButton?.on("click", printPage);
  exportButton?.on("click", exportToWhatsApp);
  textForm?.on("change", getCoupons);
  printTab.on("click", showCoupons);
  myCouponsTab.on("click", showList);
  homeTab.on("click", home);
  whatsAppLink.on("click", shareToWhatsApp);

  // Get saved coupons from storage
  myCoupons = db.getAll();
  if (myCoupons.length) {
    printTab.removeClass("disabled");
  }
}

function home() {
  couponsAlert.hide();
}

function shareToWhatsApp() {
  myCoupons = db.getAll().filter((c) => !c.used);
  let message = "";
  myCoupons.forEach((c) => {
    message += `${c.id} (${NIS}${c.price})\n`;
  });
  whatsAppLink.attr(
    "href",
    `whatsapp://send?text=${encodeURIComponent(message)}`
  );
}

function exportToWhatsApp(e: Event) {
  // e.preventDefault();
  myCoupons = db.getAll();
  let message = "";
  myCoupons.forEach((c) => {
    message += `${c.brand},${c.id},${NIS}${c.price},${c.expire},${c.hash},${c.used}\n`;
  });
  exportButton.attr(
    "href",
    `whatsapp://send?text=${encodeURIComponent(message)}`
  );
}

// Functions
async function getCoupons() {
  try {
    // Reset
    coupons.length = 0;

    // Trim text
    const cleanText = textArea.val()?.toString().trim();

    // Get all messages matches
    const matches = cleanText?.match(shufesalMessageRegex);
    const importMatches = cleanText?.match(importMessageRegex);

    // If we didn't find anything in paste message exit function
    if (!matches && !importMatches) {
      couponsAlert.text("לא נמצאו קופונים").show();
      return;
    }

    if (matches) {
      // Create coupons from regex matches and fetch their Id from Sodexo
      for (const message of matches) {
        const messageDetails = message.match(captureRegex);
        if (!messageDetails) {
          continue;
        }

        const brand = messageDetails?.[0];
        const price = Number(messageDetails?.[1].replace(NIS, ""));
        const link = messageDetails?.[2];
        const expire = messageDetails?.[3];
        const coupon = coupons.find((c) => c.link === link);

        // If coupon exist, return
        if (coupon) {
          continue;
        }

        const newCoupon = new Coupon(brand, price, link, expire);
        await newCoupon.getId();
        coupons.push(newCoupon);
      }
    }
    if (importMatches) {
      for (const message of importMatches) {
        const messageDetails = message.match(captureImportRegex);
        if (!messageDetails) {
          continue;
        }

        const brand = messageDetails[0];
        const id = messageDetails[1];
        const price = Number(messageDetails?.[2].replace(NIS, ""));
        const expire = messageDetails?.[3];
        const link = `${config.baseUrl}/b?${messageDetails?.[4]}`;
        const used = messageDetails[5] === 'true' ? true : false;
        const coupon = coupons.find((c) => c.link === link);

        // If coupon exist, return
        if (coupon) {
          continue;
        }

        const newCoupon = new Coupon(brand, price, link, expire, used);
        newCoupon.id = id;
        coupons.push(newCoupon);
      }
    }

    // Show info
    const matchesLength = matches?.length || 0;
    const importMatchesLength = importMatches?.length || 0;
    const len = matchesLength + importMatchesLength;
    if (couponsAlert) {
      couponsAlert.text(`נמצאו ${len} קופונים`);
    }
    couponsAlert.show();

    // Add to storage
    coupons.forEach((c) => {
      db.add(c);
      db.save();
    });

    printTab.removeClass("disabled");
  } catch (error) {
    throw error;
  }
}

function showList() {
  // Get All Coupons from DB
  myCoupons = db.getAll();

  // If no coupons then return
  if (!myCoupons.length) {
    noCoupons.show();
    totalWorth.text("");
    return;
  }

  // Reset view before render
  noCoupons.hide();
  myCouponsContainer.html("");

  // Draw list of coupons
  let total = 0;
  let totalUsed = 0;
  let totalUnused = 0;
  myCoupons.forEach((c) => {
    total += c.price;
    if (c.used) {
      totalUsed += c.price;
    } else {
      totalUnused += c.price;
    }
    const newBarcode = $(couponItemTemplate(c));
    newBarcode.find("svg").on("click", deleteCoupon);
    newBarcode.find("input").on("click", updateCoupon);
    myCouponsContainer.append(newBarcode);
  });

  // Update total
  totalWorth.html(
    `יתרה: ${NIS}${totalUnused} <br><small>סה"כ נוצל: ${NIS}${totalUsed}</small>`
  );
}

async function showCoupons() {
  // Get All coupons from DB
  myCoupons = db.getAll().filter((c) => !c.used);

  // Show all bar-codes
  if (printContainer) {
    printContainer.show();
  }

  // Create bar-codes html
  const existingDiv = $("#barcodeContainer");
  if (existingDiv) {
    existingDiv.remove();
  }

  if (!myCoupons.length) {
    return;
  }

  const div = $("<div>");
  div.attr("id", "barcodeContainer");
  div.html(generateBarcodeHTML(myCoupons));
  printContainer.append(div);
}

function updateCoupon(this: HTMLElement) {
  const targetElement = $(this);
  const id = targetElement.attr("id");
  const checked = targetElement.is(":checked");
  if (id) {
    db.updateState(id, checked);
    showList();
  }
}

function deleteCoupon(this: HTMLElement) {
  const targetElement = $(this);
  const id = targetElement.data("id");
  db.delete(id);
  targetElement.parent("li").remove();
  showList();
}

main();
