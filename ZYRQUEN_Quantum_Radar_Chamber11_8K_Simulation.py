# -*- coding: utf-8 -*-
import json
import os
import math
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

def run_quantum_radar_simulation():
    print("[*] Initiating Chamber 11: 8K Quantum Radar threat detection stream...")
    
    # 1. Setup Simulation Parameters & Attack Vectors
    # Model 6 distinct threat vectors detected by the Quantum Radar
    threat_vectors = [
        {
            "id": "VEC-101",
            "name": "Shor's Algorithm Factorization Probe",
            "threat_type": "Quantum Cryptanalysis",
            "angle_deg": 45,
            "distance_pct": 85,  # Close to core (100% is max distance, smaller distance is closer and more critical!)
            "risk_score": 0.98,
            "status": "CRITICAL_THREAT",
            "mitigation": "Enforce Fail-Closed & Switch to SPHINCS+"
        },
        {
            "id": "VEC-102",
            "name": "Lattice-Reduction (BKZ) Probe",
            "threat_type": "Quantum Lattice Attack",
            "angle_deg": 135,
            "distance_pct": 60,
            "risk_score": 0.88,
            "status": "WARNING_THREAT",
            "mitigation": "Quarantine Probe Source & Dilithium Key Swap"
        },
        {
            "id": "VEC-103",
            "name": "High-Frequency Signature Replay Flood",
            "threat_type": "Network Replay",
            "angle_deg": 220,
            "distance_pct": 30,  # Very close to core!
            "risk_score": 0.95,
            "status": "CRITICAL_THREAT",
            "mitigation": "Block IP & Activate Chamber 02 Quarantine"
        },
        {
            "id": "VEC-104",
            "name": "FIPS Tamper Foil Voltage Probe",
            "threat_type": "Physical Intercept",
            "angle_deg": 290,
            "distance_pct": 15,  # Critically close to hardware!
            "risk_score": 1.00,
            "status": "HARDWARE_TAMPER",
            "mitigation": "Trigger Active Zeroization on HSM TC-03"
        },
        {
            "id": "VEC-105",
            "name": "Standard API Transaction Stream",
            "threat_type": "Normal Traffic",
            "angle_deg": 80,
            "distance_pct": 95,  # Far away
            "risk_score": 0.05,
            "status": "NORMAL_RESOLVED",
            "mitigation": "Commit to G11 Canonical Core"
        },
        {
            "id": "VEC-106",
            "name": "Oracle Feed Coherence Checking",
            "threat_type": "Data Alignment",
            "angle_deg": 340,
            "distance_pct": 90,
            "risk_score": 0.12,
            "status": "NORMAL_RESOLVED",
            "mitigation": "Sync with Runtime Deck Frozen (Chamber 16)"
        }
    ]

    # Calculate Cartesian coordinates for plotting (r = distance_pct, theta = angle_deg)
    # Inside the radar, r=0 is the G11 Core (most protected), r=100 is boundary.
    # To make it look like a radar, closer to center is higher risk!
    # Let's map radius as (100 - distance_pct) so higher risk is closer to center.
    for vec in threat_vectors:
        r = vec["distance_pct"]
        theta = math.radians(vec["angle_deg"])
        vec["radar_x"] = r * math.cos(theta)
        vec["radar_y"] = r * math.sin(theta)

    # 2. Save JSON Report
    results = {
        "radar_system": "Chamber 11: 8K Quantum Radar Threat Detection Core",
        "target_system": "ZYRQUEN Ω∞ (LOCKED_FROZEN_v1.2_LTS)",
        "block_height": 849202,
        "coherence_pct": 99.992,
        "cryo_temp_mk": 14.98,
        "total_active_vectors_detected": len(threat_vectors),
        "threat_vectors": threat_vectors,
        "radar_verdict": {
            "status": "COMPROMISE_PREVENTED_FAIL_CLOSED_ACTIVE",
            "remediation_status": "FIPS_Level_4_Shields_Armed",
            "thai_law_admissibility": "FORENSIC_READY_SEC_9_26_28_OK"
        }
    }

    os.makedirs("/workspace/scratch", exist_ok=True)
    os.makedirs("/workspace/out", exist_ok=True)

    with open("/workspace/scratch/zyrquen-quantum-radar-results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print("[✓] Saved results JSON to scratch.")

    # 3. Create Radar Chart Plot
    sns.set_theme(style="dark", palette="colorblind", font="DejaVu Sans")
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw={'projection': 'polar'})
    
    # Customize the polar plot background to look like a green-glowing militaristic/sovereign radar
    ax.set_facecolor('#051605')  # Very dark green
    fig.patch.set_facecolor('#020b02')  # Darkest green/black
    
    # Grid lines green
    ax.grid(True, color='#00ff00', alpha=0.25, linestyle='--')
    ax.spines['polar'].set_color('#00ff00')
    ax.spines['polar'].set_linewidth(1.5)
    
    # Tick labels green
    plt.xticks(color='#00ff00', fontsize=9)
    plt.yticks(color='#00ff00', fontsize=8)
    
    # Plot concentric circles representing risk thresholds
    # We can plot circles using ax.plot
    angles_circle = np.linspace(0, 2*np.pi, 100)
    for r_circle in [25, 50, 75, 100]:
        ax.plot(angles_circle, [r_circle]*100, color='#00ff00', alpha=0.2, linewidth=1)
        
    # Plot radar sweeps
    sweep_angle = np.linspace(0, 2*np.pi, 200)
    # Draw a sweep effect (fading green slice)
    for i in range(10):
        ax.fill_between(sweep_angle + i*0.05, 0, 100, color='#00ff00', alpha=0.015 * (10 - i))

    # Add threat points
    for vec in threat_vectors:
        theta = math.radians(vec["angle_deg"])
        r = vec["distance_pct"] # Radius represents distance (100 is furthest, 0 is closest)
        
        # Color based on threat status
        if vec["status"] == "CRITICAL_THREAT" or vec["status"] == "HARDWARE_TAMPER":
            color = '#ff3333'  # Bright Red
            marker = 'o'
            size = 120
            # Draw outer danger ring
            ax.scatter(theta, r, s=250, facecolors='none', edgecolors='#ff3333', alpha=0.4, linewidths=1.5)
        elif vec["status"] == "WARNING_THREAT":
            color = '#ff9900'  # Orange
            marker = '^'
            size = 100
        else:
            color = '#33cc33'  # Soft Green
            marker = 's'
            size = 80
            
        ax.scatter(theta, r, color=color, marker=marker, s=size, zorder=5, label=vec["status"])
        
        # Add labels offset
        # Offset to prevent overlap
        ax.text(theta, r + 5, f"{vec['id']}: {vec['threat_type']}", color='#ffffff', 
                fontsize=8, fontweight='bold', ha='center', va='bottom',
                bbox=dict(boxstyle="round,pad=0.2", fc='#020b02', ec=color, alpha=0.8, lw=1))

    # Center label representing Core G11
    ax.scatter(0, 0, color='#ffffff', marker='*', s=250, zorder=10, label="Canonical Core G11")
    ax.text(0, 5, "CORE G11", color='#ffffff', fontsize=9, fontweight='bold', ha='center')

    # Legend & Custom Styling
    ax.set_title("8K Quantum Radar Detected 4 Active Security Threats on Core G11 Boundaries", 
                 color='#ffffff', fontsize=12, fontweight='bold', pad=25)
    
    # Add source credit
    plt.figtext(0.02, 0.02, "Source: Chamber 11 [8K QUANTUM RADAR] Telemetry Bus", color='#00ff00', fontsize=8, alpha=0.6)
    
    plt.tight_layout(pad=1.5)
    fig.savefig("/workspace/scratch/zyrquen-quantum-radar-chart.png", dpi=150, bbox_inches='tight', facecolor=fig.get_facecolor())
    plt.close()
    print("[✓] Saved radar visualization to scratch.")

if __name__ == "__main__":
    run_quantum_radar_simulation()
