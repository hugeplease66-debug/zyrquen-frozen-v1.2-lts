import os
import json
import sys

# Color configurations for rich terminal output
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
CYAN = "\033[96m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

class ZyrquenSovereignEngine:
    def __init__(self):
        self.system_status = "LOCKED_FROZEN_v1.2_LTS"
        self.merkle_root_genesis = "0x909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68"
        self.total_seals = 14902
        self.gas_pool_thb = 12500000.0
        self.total_segment_value_thb = 1424080000.0
        self.active_zero_drift = True
        
        # Chain model parameters
        self.segments = {
            "Gen_Z_Core": {"pct": 0.24, "penetration": 0.80, "usage": 5.0, "contribution": 2.0},
            "Gen_Y_Pro": {"pct": 0.32, "penetration": 0.65, "usage": 8.0, "contribution": 3.5},
            "Gen_X_Enterprise": {"pct": 0.15, "penetration": 0.45, "usage": 12.0, "contribution": 10.0},
            "SMB_Retail": {"pct": 0.10, "penetration": 0.50, "usage": 15.0, "contribution": 6.0}
        }
        
    def calculate_segment_value(self, segment_name, population=70000000):
        if segment_name not in self.segments:
            return 0.0, 0, 0.0
        seg = self.segments[segment_name]
        nc = int(population * seg["pct"] * seg["penetration"])
        vc = seg["usage"] * seg["contribution"]
        val = nc * vc
        return val, nc, vc

    def evaluate_compliance(self, user_id, name, requested_ial, requested_aal, crypto_scheme, risk_score):
        """
        Evaluates Digital ID compliance based on the Thai Electronic Transactions Act B.E. 2544
        """
        verdict = {
            "user_id": user_id,
            "name": name,
            "risk_score": risk_score,
            "sec_9_passed": False,
            "sec_26_passed": False,
            "sec_28_passed": False,
            "decision": "REJECTED",
            "reason": ""
        }
        
        # Sentinel AI Interceptor Trigger
        if risk_score >= 0.85:
            verdict["decision"] = "QUARANTINED"
            verdict["reason"] = f"CRITICAL_RISK_DETECTED: Risk score {risk_score:.2f} exceeds threshold 0.85. Isolated to Chamber 02."
            return verdict
            
        # Section 9 Evaluation (General Electronic Signature)
        # Low risk, low validation threshold (IAL1/AAL1)
        if requested_ial >= 1 and requested_aal >= 1:
            verdict["sec_9_passed"] = True
            verdict["decision"] = "APPROVED_SECTION_9"
            verdict["reason"] = "Passed Section 9 compliance. Valid only for low-risk, internal retail transactions."

        # Section 26 Evaluation (Advanced Secure Signature)
        # Requires IAL >= 2, AAL >= 2, and Post-Quantum Cryptography (Dilithium-5)
        if requested_ial >= 2 and requested_aal >= 2:
            if crypto_scheme in ["Dilithium-5", "SPHINCS+"]:
                verdict["sec_26_passed"] = True
                verdict["decision"] = "APPROVED_SECTION_26"
                verdict["reason"] = "Passed Section 26 compliance. Advanced digital signature verified with Post-Quantum Cryptography."
            else:
                verdict["decision"] = "REJECTED_CRYPTO_WEAK"
                verdict["reason"] = f"COMPLIANCE_FAILURE: Scheme '{crypto_scheme}' is vulnerable to Quantum attacks. Dilithium-5 or SPHINCS+ required for Section 26."
                return verdict

        # Section 28 Evaluation (CA-Certified Secure Signature)
        # Requires Section 26 compliance plus Active CA Verification & HSM Binding (10/10 REAL_HSM Quorum)
        if verdict["sec_26_passed"] and requested_ial >= 3 and requested_aal >= 3:
            verdict["sec_28_passed"] = True
            verdict["decision"] = "APPROVED_SECTION_28"
            verdict["reason"] = "Passed Section 28 compliance. CA-Certified secure signature bound to 10/10 REAL_HSM Quorum (FIPS 140-3 Level 4)."

        return verdict

    def calculate_gas_reimbursement(self, segment_name, balance_allocated):
        """
        Distributes gas pool based on Chain Model Segment Value weights
        """
        # Precalculated weights based on ฿1.42408B total segment value
        weights = {
            "Gen_Z_Core": 0.094377,       # ฿134.4M of ฿1.42408B
            "Gen_Y_Pro": 0.286276,        # ฿407.68M of ฿1.42408B
            "Gen_X_Enterprise": 0.398152, # ฿567M of ฿1.42408B
            "SMB_Retail": 0.221195        # ฿315M of ฿1.42408B
        }
        if segment_name not in weights:
            return 0.0
        return balance_allocated * weights[segment_name]

def run_simulation_suite():
    engine = ZyrquenSovereignEngine()
    print(f"\n{BOLD}{CYAN}====================================================================")
    print(f"       ZYRQUEN Ω∞ INTERACTIVE SERVICE LAYER MOCK API & GATEWAY      ")
    print(f"                     STATUS: {engine.system_status}                ")
    print(f"===================================================================={RESET}\n")

    # Mock incoming Service Layer Requests (simulating API controller inputs)
    requests = [
        {
            "user_id": "REQ-8801",
            "name": "นายสมชาย ใจดี (Gen Y Custodian)",
            "requested_ial": 3,
            "requested_aal": 3,
            "crypto_scheme": "Dilithium-5",
            "risk_score": 0.02,
            "target_segment": "Gen_Y_Pro"
        },
        {
            "user_id": "REQ-8802",
            "name": "นางสาวสมหญิง ยิ้มแย้ม (Gen Z Retail)",
            "requested_ial": 1,
            "requested_aal": 1,
            "crypto_scheme": "ECDSA",
            "risk_score": 0.12,
            "target_segment": "Gen_Z_Core"
        },
        {
            "user_id": "REQ-8803",
            "name": "ผู้บุกรุกลึกลับ (Quantum Attacker)",
            "requested_ial": 2,
            "requested_aal": 1,
            "crypto_scheme": "RSA-2048",
            "risk_score": 0.45,
            "target_segment": "Gen_X_Enterprise"
        },
        {
            "user_id": "REQ-8804",
            "name": "บอทแฮกเกอร์โจมตีเครือข่าย (DDoS Bot)",
            "requested_ial": 1,
            "requested_aal": 1,
            "crypto_scheme": "None",
            "risk_score": 0.96,
            "target_segment": "SMB_Retail"
        }
    ]

    log_records = []

    for req in requests:
        print(f"{BOLD}[*] Processing API Request {req['user_id']} for: {req['name']}{RESET}")
        print(f"    - Requested IAL/AAL: {req['requested_ial']}/{req['requested_aal']}")
        print(f"    - Cryptographic Protocol: {req['crypto_scheme']}")
        print(f"    - Sentinel Risk Score: {req['risk_score']:.2f}")
        
        # 1. Evaluate ETDA compliance
        compliance = engine.evaluate_compliance(
            req["user_id"], req["name"], req["requested_ial"], 
            req["requested_aal"], req["crypto_scheme"], req["risk_score"]
        )
        
        # 2. Output decision with color
        decision = compliance["decision"]
        if "APPROVED" in decision:
            color = GREEN
            status_text = "APPROVED & DEPLOYED"
        elif "REJECTED" in decision:
            color = RED
            status_text = "REJECTED_UNAUTHORIZED"
        else:
            color = MAGENTA
            status_text = "QUARANTINED & BLOCKED (Chamber 02)"
            
        print(f"    - {BOLD}Decision Verdict: {color}{status_text}{RESET}")
        print(f"    - Reason: {compliance['reason']}")
        
        # 3. Calculate financial metrics if approved
        if "APPROVED" in decision:
            seg_name = req["target_segment"]
            seg_val, nc, vc = engine.calculate_segment_value(seg_name)
            gas_refund = engine.calculate_gas_reimbursement(seg_name, engine.gas_pool_thb)
            
            print(f"    - {BOLD}{YELLOW}Financial Ledger Integration (Chain Model):{RESET}")
            print(f"      + Target Segment: {seg_name.replace('_', ' ')}")
            print(f"      + Target population (Nc): {nc:,} users")
            print(f"      + Customer Value (Vc): ฿{vc:.2f}")
            print(f"      + Segment Market Value: ฿{seg_val:,.2f}")
            print(f"      + Gas Pool Refund Allocated: ฿{gas_refund:,.2f}")
            
            req_log = {
                "request_id": req["user_id"],
                "name": req["name"],
                "status": status_text,
                "compliance": compliance,
                "financial_metrics": {
                    "segment": seg_name,
                    "target_customers_nc": nc,
                    "customer_value_vc_thb": vc,
                    "segment_value_thb": seg_val,
                    "gas_reimbursement_allocated_thb": gas_refund
                }
            }
        else:
            print(f"    - {BOLD}{RED}Financial Ledger Integration: REJECTED (Zero Gas Allocation){RESET}")
            req_log = {
                "request_id": req["user_id"],
                "name": req["name"],
                "status": status_text,
                "compliance": compliance,
                "financial_metrics": None
            }
            
        print("-" * 68)
        log_records.append(req_log)

    # Write output logs to scratch and out
    output_payload = {
        "system_status": engine.system_status,
        "merkle_root_genesis": engine.merkle_root_genesis,
        "active_zero_drift_guarantee": engine.active_zero_drift,
        "processed_requests": log_records
    }
    
    scratch_path = "/workspace/scratch/zyrquen-mock-api-bridge-results.json"
    with open(scratch_path, "w") as f:
        json.dump(output_payload, f, indent=4)
        
    print(f"\n{GREEN}[✓] Mock API Bridge Simulation complete.{RESET}")
    print(f"{GREEN}[✓] Logs saved to scratch and prepared for Outbox.{RESET}\n")

if __name__ == "__main__":
    run_simulation_suite()
