package com.luxora.payment.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The order id created by Razorpay (used on frontend & for verification)
    @Column(name = "razorpay_order_id", nullable = false)
    private String razorpayOrderId;

    // Amount stored in rupees (integer). You can store paise or use BigDecimal if needed.
    private int amount;

    private String currency;

    // CREATED, PAID, FAILED
    private String status;
}
