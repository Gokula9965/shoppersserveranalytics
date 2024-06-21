const transformData = (data) => {
    const transformed = [];

    data.forEach(order => {
        order.customerItems.forEach(item => {
            transformed.push({
                orderId: order?.orderId,
                Name: `${order?.firstName} ${order.lastName}`,
                Address: `${order?.address1}, ${order?.city}-${order?.postalCode}, ${order?.state}, ${order?.country}`,
                Email: order?.email,
                PhoneNumber: order?.phoneNumber,
                OrderDetails: {
                    OrderedAt: order?.orderedAt,
                    ProductName: item?.title,
                    Quantity: item?.quantity,
                    Price: item?.price * 84
                },
                TotalAmount: order.totalAmount
            });
        });
    });

    return transformed;
}

module.exports=transformData