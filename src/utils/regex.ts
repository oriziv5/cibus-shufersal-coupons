// New israel Shekel sign
export const NIS = "₪";
export const PREFIX = "בשובר ";
/**
 * This regex capture the price, link and expiry from a valid coupon message.
 */
export const captureRegex = /בשובר\s(?<brand>שופרסל|Be|ויקטורי)|(?<price>₪\d{2,3})|(?<link>https:\/\/www.mysodexo.co.il\/b\?\w{16,20})|(?<expire>\d{2}\/\d{2}\/\d{4})/g;
export const captureImportRegex = /(?<brand>שופרסל|Be|ויקטורי)|(?<id>\d{16,20})|(?<price>₪\d{2,3})|(?<link>\w{16,20})|(?<expire>\d{2}\/\d{2}\/\d{4})|(?<used>true|false)/g;
/**
 * Regex to capture Shufersal coupon id
 */
export const cidRegex = /\d{20,22}/;
/**
 * This regex capture a valid coupon message sent from cibus.
 * @todo improve with capture hebrew chars only.
 * @todo be able to read multiple messages from whatsapp.
 */
export const shufesalMessageRegex = /.+\₪\d{2,3}.+https:\/\/www\.mysodexo\.co\.il\/b\?\w{16,20}\s.+\d{2}\/\d{2}\/\d{4}$/gm;
export const importMessageRegex = /(Be|ויקטורי|שופרסל)\,(\d+)\,(\₪\d{1,3})\,(\d{2}\/\d{2}\/\d{4})\,(\w+)\,(true|false)$/gm;

export const onlyHebrewPattern = /^[\u0590-\u05FF\s,.:'-]+$/i;