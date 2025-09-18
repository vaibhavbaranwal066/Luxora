/**
 * 
 */
package com.luxora.payment.service;



import com.luxora.payment.entity.OrderEntity;
import com.luxora.payment.repository.OrderRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.Order;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    private final OrderRepository orderRepository;

    public PaymentService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Create a Razorpay order and save a local order row.
     *
     * @param amountInRupees amount in rupees (integer) for simplicity
     * @param currency       "INR"
     * @return a map with keys: orderId (razorpay order id), amount (paise), currency, internalOrderId
     * @throws Exception on failure creating razorpay order
     */
    @Transactional
    public Map<String, Object> createOrder(int amountInRupees, String currency) throws Exception {
        // Create Razorpay client (simple approach). For production, create as a bean and reuse.
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        // Razorpay expects amount in smallest currency unit (paise) => multiply by 100
        int amountInPaise = amountInRupees * 100;

        JSONObject options = new JSONObject();
        options.put("amount", amountInPaise);
        options.put("currency", currency);
        options.put("receipt", "txn_" + System.currentTimeMillis());

        logger.info("Creating Razorpay order with options: {}", options.toString());

        // This calls Razorpay API and returns an Order (org.json based object)
        Order razorpayOrder = client.Orders.create(options);

        // Extract Razorpay order id
        String razorpayOrderId = razorpayOrder.get("id").toString();

        // Save local order entry
        OrderEntity entity = new OrderEntity();
        entity.setRazorpayOrderId(razorpayOrderId);
        entity.setAmount(amountInRupees);   // saving in rupees for readability
        entity.setCurrency(currency);
        entity.setStatus("CREATED");

        OrderEntity saved = orderRepository.save(entity);

        // Build response for frontend
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", razorpayOrderId);
        response.put("amount", amountInPaise); // frontend expects paise
        response.put("currency", currency);
        response.put("internalOrderId", saved.getId());

        return response;
    }
}
