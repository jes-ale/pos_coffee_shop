/** @odoo-module **/

import { patch } from 'web.utils'
import { PosGlobalState, Product, Order, Orderline } from 'point_of_sale.models'

patch(PosGlobalState.prototype, "prototype patch", {
    _processData: async function(loadedData) {
        this._loadProductTemplate(loadedData['product.template']);
        this._super(loadedData);
    },
    _loadProductTemplate: function(products) {
        this.db.add_products_templates(products)
    }
});

patch(Order.prototype, "prototype patch", {
    add_product_but_well_done: async function(product, options) {
        this.assert_editable();
        options = options || {};
        var line = Orderline.create({}, { pos: this.pos, order: this, product: product });
        this.fix_tax_included_price(line);
        this.set_orderline_options(line, options);
        // NOTE: do not merge the lines...
        this.add_orderline(line);
        this.select_orderline(this.get_last_orderline());
        return Promise.resolve(line);
    }
});

