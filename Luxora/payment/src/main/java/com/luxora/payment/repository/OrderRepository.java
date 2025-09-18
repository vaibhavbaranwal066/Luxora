package com.luxora.payment.repository;

import com.luxora.payment.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Optional<OrderEntity> findByRazorpayOrderId(String razorpayOrderId);
}
