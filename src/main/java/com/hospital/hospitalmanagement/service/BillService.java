package com.hospital.hospitalmanagement.service;

import com.hospital.hospitalmanagement.entity.Bill;
import com.hospital.hospitalmanagement.entity.Patient;
import com.hospital.hospitalmanagement.repository.BillRepository;
import com.hospital.hospitalmanagement.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public BillService(
            BillRepository billRepository,
            PatientRepository patientRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
    }

    public Bill createBill(Bill bill) {
        if (bill.getPatient() == null || bill.getPatient().getId() == null) {
            throw new IllegalArgumentException("Patient ID is required");
        }

        Long patientId = bill.getPatient().getId();

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found: " + patientId));

        bill.setId(null);
        bill.setPatient(patient);
        bill.setPaymentStatus("PENDING");

        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found: " + id));
    }

    public Bill updatePaymentStatus(Long id, String status) {
        if (!List.of("PENDING", "PAID", "CANCELLED").contains(status)) {
            throw new IllegalArgumentException("Invalid payment status");
        }

        Bill bill = getBillById(id);
        bill.setPaymentStatus(status);

        return billRepository.save(bill);
    }
}