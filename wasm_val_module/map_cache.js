// Copyright 2019 Vladimir Iftodi <Vladimir.Iftodi@gmail.com>. 
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

export class MapCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }

    _maintainSize() {
        if(this.cache.size > this.maxSize) {
            const firstKey = this.cache.keys().next().value;

            this.cache.delete(firstKey);
        }
    }

    put(key, val) {
        this._maintainSize();
        this.cache.set(key, val);
    }

    getOrSet(key, valProducer) {
        if(this.cache.has(key)) {
            return this.cache.get(key);
        } else {
            const val = valProducer();

            this.put(key, val);

            return val;
        }
    }


}