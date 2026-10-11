package com.hospital.hospitalmanagement.controller;

import com.hospital.hospitalmanagement.entity.Bill;
import com.hospital.hospitalmanagement.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@Valid @RequestBody Bill bill) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(billService.createBill(bill));
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Bill> updatePaymentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");

        if (status == null || !List.of(
                "PENDING", "PAID", "CANCELLED").contains(status)) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                billService.updatePaymentStatus(id, status));
    }
}