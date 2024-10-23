//Author: YuFu
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const dbconnect = require('./dbConnect');



// 使用 Promise
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        dbconnect.query(sql, params, (error, results) => {
            if (error) {
                console.error('資料庫查詢錯誤:', error);
                return reject(error);
            }
            resolve(results);
        });
    });
};


//新增商品付款Session
const createCheckoutSession = async (items, shippingFee) => {
    const lineItems = items.map(item => ({
        price_data: {
            currency: 'twd',
            product_data: {
                name: `${item.name}`,
                description: `尺寸: ${item.size}`,
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));

    // 添加運費作為單獨的 line item
    lineItems.push({
        price_data: {
            currency: 'twd',
            product_data: {
                name: '運費',
                description: '商品運送費用',
            },
            unit_amount: Math.round(shippingFee * 100),
        },
        quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: `${process.env.CLIENT_URL}/Order/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
        metadata: {
            order_details: JSON.stringify(items),
            shipping_fee: shippingFee.toString()
        }
    });

    console.log('orderID :', session.id);
    console.log('orderData :', session.metadata);

    return session;
};





//新增活動付款Session
const createEventCheckoutSession = async (event) => {
    console.log('event', event)
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: event.ticketType.map(ticket => ({
            price_data: {
                currency: 'twd',
                product_data: {
                    name: `${event.eventName} - ${ticket.type}`,
                    description: event.eventDesc,
                },
                unit_amount: ticket.price * 100,
            },
            quantity: 1, // 默認為1,可以根據需求調整
        })),
        success_url: `${process.env.CLIENT_URL}/Order/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
        metadata: {
            event_id: event.eventId.toString(),
            event_name: event.eventName,
            // 將票券信息轉換為 JSON 字符串存儲在 metadata 中
            tickets: JSON.stringify(event.ticketType.map(ticket => ({
                type: ticket.type,
                quantity: ticket.quantity,
                price: ticket.price
            })))
        }
    });
    console.log('eventOrderID:', session.id);
    console.log('eventOrderData:', session.metadata);
    return session;
};





//取得SessionId
const retrieveSession = async (sessionId) => {
    return await stripe.checkout.sessions.retrieve(sessionId);
};





//保存訂單資訊
const saveOrderDetails = async (sessionId, userId) => {
    try {
        const session = await retrieveSession(sessionId);
        const sessionMetadata = session.metadata



        //商品資料送資料庫
        if (sessionMetadata.order_details) {
            const orderDetails = JSON.parse(session.metadata.order_details);
            console.log('運費: ', typeof(sessionMetadata.shipping_fee))
            const priceSum = orderDetails.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalPrice = priceSum + + parseInt(sessionMetadata.shipping_fee)
            console.log('totalPrice: ', totalPrice);
            

            // 開始資料庫
            await query('START TRANSACTION');

            try {
                // 檢查是否已存在相同的訂單
                const existingOrder = await query(
                    'SELECT orderid FROM `order` WHERE userId = ? AND totalPrice = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 5 MINUTE)',
                    [userId, totalPrice]
                );

                if (existingOrder.length > 0) {
                    await query('COMMIT');
                    return { success: true, message: '訂單已存在，無需重複處理' };
                }

                // 插入訂單表
                const result = await query(
                    'INSERT INTO `order` (userId, totalPrice, orderStatus, shipMethod, convAddr, rcptName, rcptPhone, rcptAddr, payMethod, payTime, receiptType, receiptInfo, orderRemark, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, NOW())',
                    [userId, totalPrice, '已付款', '7-11', '台北市信義路123號', '林小美', '0912-345-121', '小美家', 'card', '手機載具', 'Z1234567', '備註']
                );
                const orderId = result.insertId;
                console.log('插入訂單主表成功，orderId:', orderId);

                // 插入訂單項目
                for (const item of orderDetails) {
                    await query(
                        'INSERT INTO orderitem (orderId, productId, productName, productOpt, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
                        [orderId, item.productId, item.name, item.size, item.quantity, item.price]
                    );
                }

                // 删除 購物車項目
                await query('DELETE FROM cartitem WHERE cartId IN (SELECT cartId FROM cart WHERE userId = ?)', [userId]);

                // 删除 購物車
                await query('DELETE FROM cart WHERE userId = ?', [userId]);

                // 提交
                await query('COMMIT');

                return { success: true, message: '訂單已成功處理並保存，購物車已清空' };
            } catch (error) {
                // 如果出現錯誤，復原
                await query('ROLLBACK');
                throw error;
            }

        }


        //活動資料送資料庫
        else if (sessionMetadata.tickets) {

            const eventId = session.metadata.event_id;
            const ticketType = JSON.parse(session.metadata.tickets);

            // 開始資料庫交易
            await query('START TRANSACTION');
            try {
                // 檢查是否在過去1分鐘內存在相同的訂單
                const existingOrder = await query(
                    'SELECT tdId FROM ticketdetails WHERE userId = ? AND eventId = ? AND createdAt > DATE_SUB(NOW(), INTERVAL 1 MINUTE)',
                    [userId, eventId]
                );

                // 如果存在相同訂單，提交並返回
                if (existingOrder.length > 0) {
                    await query('COMMIT');
                    return { success: true, message: '票券訂單已存在，無需重複處理' };
                }

                // 獲取當前活動的票券
                const [eventResult] = await query(
                    'SELECT ticketType FROM events WHERE eventId = ?',
                    [eventId]
                );

                if (!eventResult) {
                    throw new Error('找不到該活動');
                }

                const currentTicketTypes = JSON.parse(eventResult.ticketType);

                // 更新票券庫存
                const updatedTicketTypes = currentTicketTypes.map(currentTicket => {
                    const purchasedTicket = ticketType.find(t => t.type === currentTicket.type);
                    if (purchasedTicket) {
                        return {
                            ...currentTicket,
                            stock: currentTicket.stock - purchasedTicket.quantity
                        };
                    }
                    return currentTicket;
                });

                // 更新資料庫中的票券庫存
                await query(
                    'UPDATE events SET ticketType = ? WHERE eventId = ?',
                    [JSON.stringify(updatedTicketTypes), eventId]
                );

                // 生成隨機數字作為取貨流水號
                const randNum = Math.floor(Math.random() * 10000000);

                // 將每種票券類型插入數據庫
                for (const ticket of ticketType) {
                    await query(
                        `INSERT INTO ticketdetails
                                (userId, eventId, ticketType, quantity, tdStatus, tdPrice, randNum, payTime, receiptType, receiptInfo, createdAt, updatedAt)
                                VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, NOW(), NOW())`,
                        [userId, eventId, ticket.type, ticket.quantity, '已付款', ticket.price, randNum, '手機載具', '/123K456']
                    );
                }

                console.log('插入票券訂單成功');

                // 提交
                await query('COMMIT');

                return { success: true, message: '票券訂單已成功處理並保存' };
            } catch (error) {
                // 如果出現錯誤，復原
                await query('ROLLBACK');
                throw error;
            }
        }
    } catch (error) {
        console.error('保存訂單詳情時發生錯誤:', error);
        return { success: false, message: '保存訂單詳情時發生錯誤' };
    }
};



//檢查票券庫存數量
const checkTicketAvailability = async (event) => {
    try {
        console.log()
        const [dbEvent] = await query(
            'SELECT ticketType FROM events WHERE eventId = ?',
            [event.eventId]
        );

        if (!dbEvent) {
            return { success: false, message: '找不到該活動拉' };
        }

        const dbTicketTypes = JSON.parse(dbEvent.ticketType);

        for (const requestedTicket of event.ticketType) {
            const dbTicket = dbTicketTypes.find(t => t.type === requestedTicket.type);
            if (!dbTicket || dbTicket.stock < requestedTicket.quantity) {
                return { success: false, message: `票券 ${requestedTicket.type} 庫存不足` };
            }
        }
        return { success: true };
    } catch (error) {
        console.error('檢查票券庫存時發生錯誤:', error);
        return { success: false, message: '檢查票券庫存時發生錯誤' };
    }
};



module.exports = {
    createCheckoutSession,
    retrieveSession,
    saveOrderDetails,
    createEventCheckoutSession,
    checkTicketAvailability
};