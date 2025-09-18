package com.example.payment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.payment.service.PaymentService;
import com.razorpay.*;

import java.util.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // API to create order
    @PostMapping("/createOrder")
    public String createOrder(@RequestParam double amount) {
        try {
            return paymentService.createOrder(amount);
        } catch (RazorpayException e) {
            e.printStackTrace();
            return "Error creating order: " + e.getMessage();
        }
    }

    // Webhook endpoint (Razorpay sends payment status here)
    @PostMapping("/webhook")
    public String handleWebhook(@RequestBody String payload, 
                                @RequestHeader("X-Razorpay-Signature") String signature) {
        // You will verify the signature in PaymentService
        paymentService.verifyWebhook(payload, signature);
        return "Webhook received successfully!";
    }
}
