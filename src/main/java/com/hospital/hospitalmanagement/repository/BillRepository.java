package com.hospital.hospitalmanagement.repository;

import com.hospital.hospitalmanagement.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}