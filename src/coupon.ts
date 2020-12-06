import { Brand, ICoupon } from "./interfaces";
import { config } from "./utils/config";
import { getIsraelDateFormat, getIsraelTimeFormat } from "./utils/date";
import { cidRegex, PREFIX } from "./utils/regex";

export class Coupon implements ICoupon {
    public barcode = '';
    public expire = '';
    public hash = '';
    public id = '';
    public link = '';
    public price = 0;
    public modified;
    public date;
    public time;
    public used = false;
    public brand;

    constructor(brand: string, price: number, link: string, expire: string, used: boolean = false) {
        this.price = price;
        this.link = link;
        this.brand = brand.replace(PREFIX,'') as Brand;
        this.expire = expire;
        this.hash = this.link.replace(`${config.baseUrl}/b?`, "");
        this.barcode = `${config.baseUrl}/b/bar.ashx?${this.hash}`;
        this.modified = new Date();
        this.date = getIsraelDateFormat(this.modified);
        this.time = getIsraelTimeFormat(this.modified);
        this.used = used;
    }

    async getId() {
        try {
              const resp = await fetch(`${config.baseUrl}/b/?${this.hash}`);
              const text = await resp.text();
              this.id = text.match(cidRegex)?.[0] as string;
          } catch (error) {
            return error;
          }
    }
}