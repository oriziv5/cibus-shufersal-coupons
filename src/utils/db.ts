import { Coupon } from "../coupon";

export function saveCoupon(coupon: Coupon) {
    if(window.localStorage) {
        const savedCoupons = localStorage.getItem('coupons');
        if(savedCoupons) {
            const json: Coupon[] = JSON.parse(savedCoupons);
            const c = json.find(t => t.hash === coupon.hash);
            if(!c) {
                json.push(coupon);
            }
            window.localStorage.setItem("coupons", JSON.stringify(json));
        }
    }
}

export class UserStorage {
    private key = 'coupons';
    private data: Coupon[] = [];
    constructor(){
        this.init();
    }

    init() {
        const saved = localStorage.getItem(this.key);
        
        if(!saved) {
            window.localStorage.setItem(this.key, JSON.stringify([]));
            return;
        }

        this.data = JSON.parse(saved);
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }

    add(coupon: Coupon) {
        const c = this.data.find(t => t.hash === coupon.hash);
        if(!c) {
            this.data.push(coupon);
        }
    }

    getAll() {
        return this.data.sort((a, b)=> {return a.used ? 1: -1});
    }

    updateState(id: string, state: boolean) {
        const coupon = this.data.find(c => c.hash === id);
        if(coupon) {
            coupon.used = state;
        }
        this.save();
    }

    delete(id: string) {
        this.data = this.data.filter(c => c.hash !== id);
        this.save();
    }
}