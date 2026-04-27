// Order model
class Order {
    constructor(id, items, customerInfo) {
        this.id = id;
        this.items = items;
        this.customerInfo = customerInfo;
        // Removed deliveryZipCode field
    }
}

module.exports = Order;