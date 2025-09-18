package com.luxora.payment;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/create")
    public String createPayment() {
        // Here you will call Razorpay API to create an order
        return "Payment created successfully!";
    }

    @PostMapping("/verify")
    public String verifyPayment() {
        // This will be your webhook verification logic
        return "Payment verified!";
    }
}
