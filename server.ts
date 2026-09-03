import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'ZYRQUEN Ω∞ FROZEN v1.2 LTS Sovereign Operating System and Civilization Intelligence Control Plane',
    timestamp: new Date().toISOString(),
  });
});

// Google Search Grounding API for Thai Custodian Registry Laws & Cryptographic Standards
app.post('/api/search', async (req, res) => {
  const { query, category } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Search query is required.' });
  }

  const ai = getAIClient();

  // If Gemini API Key is available, use Google Search Grounding
  if (ai) {
    try {
      const prompt = `You are the Sovereign Legal & Cryptographic Intelligence Oracle for ZYRQUEN Ω∞ FROZEN v1.2 LTS and the Thai Custodian Registry (นายยุทธภูมิ พากเพียร #EP-SOVEREIGN-01).
Query: "${query}"
Context: Research current Thai digital laws (e.g. พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA), พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์, พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562, พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544/2562, ประกาศ NCSA, ETDA) and modern Cryptographic standards (NIST Post-Quantum Cryptography FIPS 203 ML-KEM, FIPS 204 ML-DSA, FIPS 205 SLH-DSA, SHA-256 Merkle Roots, ISO/IEC 27001).

Provide an authoritative, detailed, structured response with:
1. Executive Summary & Legal/Technical Assessment
2. Relevant Thai Statutes / NIST / Cryptographic Standard Articles & Clauses
3. Concrete Relevance to Sovereign Custodians & Post-Quantum Ledger Security
4. Verification Guidance & Citations`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || 'No response generated from search oracle.';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web?.title || 'Web Citation',
          uri: chunk.web?.uri,
        }));

      return res.json({
        query,
        source: 'Google Search Grounding (Live)',
        answer: text,
        citations: sources,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.warn('Gemini Search error, falling back to local canonical knowledge base:', error?.message);
    }
  }

  // Authoritative Built-in Fallback Knowledge Base for Thai Laws & Cryptographic Standards
  const lower = query.toLowerCase();
  let answer = '';
  let citations: Array<{ title: string; uri: string }> = [];

  if (lower.includes('pdpa') || lower.includes('ข้อมูลส่วนบุคคล') || lower.includes('personal data')) {
    answer = `**พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA Thailand)**
- **มาตรา 19 & 27**: กำหนดหลักการขอความยินยอม (Consent) และข้อยกเว้นทางกฎหมายสำหรับการประมวลผลข้อมูลส่วนบุคคลและข้อมูลอ่อนไหว (Sensitive Data)
- **มาตรา 37**: ผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller) ต้องจัดให้มีมาตรการรักษาความมั่นคงปลอดภัยที่เหมาะสม (Appropriate Security Measures) เช่น การเข้ารหัสข้อมูล (Encryption), การควบคุมการเข้าถึง (Access Control), และการบันทึก Log การเข้าถึง
- **ความสอดคล้องกับ ZYRQUEN Ω∞**: การเก็บรักษาข้อมูลใน Post-Quantum Vault ปฏิบัติตามหลัก Data Minimization และเข้ารหัสแบบ Zero-Knowledge โดยมีผู้ถือสิทธิ์ Sovereign Principal นายยุทธภูมิ พากเพียร กำกับดูแล`;
    citations = [
      { title: 'ราชกิจจานุเบกษา - พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562', uri: 'https://www.ratchakitcha.soc.go.th' },
      { title: 'สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส. / PDPC)', uri: 'https://www.pdpc.or.th' },
    ];
  } else if (lower.includes('cyber') || lower.includes('มั่นคงปลอดภัย') || lower.includes('ncsa') || lower.includes('กมช.')) {
    answer = `**พระราชบัญญัติการรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562 & ประกาศ กมช. (NCSA Thailand)**
- **โครงสร้างพื้นฐานสำคัญทางสารสนเทศ (CII)**: กำหนด 8 ด้านสำคัญ (รวมถึง ความมั่นคง, บริการภาครัฐ, และเทคโนโลยีสารสนเทศ)
- **ระดับภัยคุกคามทางไซเบอร์**: แบ่งเป็นระดับไม่ร้ายแรง, ร้ายแรง (Critical), และวิกฤต (Crisis) พร้อมแนวทางการตอบสนองแบบ Fail-Closed
- **ความสอดคล้องกับ ZYRQUEN Ω∞**: ระบบรักษาความปลอดภัย Zero Trust Gateway และ 10 System Invariants ถูกออกแบบตามมาตรฐาน ISO/IEC 27001 และ NCSA National Cyber Security Framework`;
    citations = [
      { title: 'สำนักงานคณะกรรมการการรักษาความมั่นคงปลอดภัยไซเบอร์แห่งชาติ (สกมช. / NCSA)', uri: 'https://www.ncsa.or.th' },
      { title: 'พระราชบัญญัติการรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562', uri: 'https://www.ratchakitcha.soc.go.th' },
    ];
  } else if (lower.includes('nist') || lower.includes('pqc') || lower.includes('quantum') || lower.includes('fips') || lower.includes('ml-kem') || lower.includes('ml-dsa')) {
    answer = `**NIST Post-Quantum Cryptography (PQC) Standards (FIPS 203, 204, 205)**
- **FIPS 203 (ML-KEM)**: Module-Lattice-Based Key-Encapsulation Mechanism สำหรับการแลกเปลี่ยนกุญแจลับที่ทนทานต่อการโจมตีจาก Quantum Computer (Shor's Algorithm)
- **FIPS 204 (ML-DSA)**: Module-Lattice-Based Digital Signature Standard สำหรับลายมือชื่อดิจิทัลพ้นควอนตัม
- **FIPS 205 (SLH-DSA)**: Stateless Hash-Based Digital Signature Standard ที่อิงตามฟังก์ชันแฮชแบบไม่ขึ้นกับโครงสร้างแลตทิซ
- **ความสอดคล้องกับ ZYRQUEN Ω∞**: Post-Quantum Evidence Ledger V25 ใช้สถาปัตยกรรม Merkle Root Binding ผสาน SHA-256 และ Hybrid PQC Enclave เพื่อรับประกันความไม่เปลี่ยนแปลง (Immutability) ของ 14,902 บล็อกหลักฐาน`;
    citations = [
      { title: 'NIST Releases Initial Post-Quantum Cryptography Standards (FIPS 203, 204, 205)', uri: 'https://csrc.nist.gov/projects/post-quantum-cryptography' },
      { title: 'ETDA Thailand Post-Quantum Guidelines', uri: 'https://www.etda.or.th' },
    ];
  } else if (lower.includes('ธุรกรรม') || lower.includes('electronic') || lower.includes('etda') || lower.includes('2544')) {
    answer = `**พระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 และที่แก้ไขเพิ่มเติม (ฉบับที่ 3 และ 4 พ.ศ. 2562)**
- **มาตรา 9 & 26**: การรับรองผลทางกฎหมายของลายมือชื่ออิเล็กทรอนิกส์ (Electronic Signature) และลายมือชื่อดิจิทัลที่เชื่อถือได้
- **มาตรา 28**: หน้าที่และความรับผิดของเจ้าของข้อมูลสำหรับการสร้างลายมือชื่อ
- **ความสอดคล้องกับ ZYRQUEN Ω∞**: ตราประทับอธิปไตยดิจิทัล (Sovereign Executive Passport #EP-SOVEREIGN-01) และ Merkle Leaf Signatures ได้รับการออกแบบตามมาตรฐานลายมือชื่ออิเล็กทรอนิกส์ที่เชื่อถือได้ระดับสูง`;
    citations = [
      { title: 'สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (สพธอ. / ETDA)', uri: 'https://www.etda.or.th' },
      { title: 'พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์', uri: 'https://www.ratchakitcha.soc.go.th' },
    ];
  } else {
    answer = `**ระเบียบข้อบังคับและมาตรฐานทางเทคนิคสำหรับ ZYRQUEN Ω∞ Sovereign Operating System & Thai Custodian Registry**
- **สถาปัตยกรรมอธิปไตย (Sovereign Architecture)**: ควบคุมโดยสถาปนิกสูงสุด นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01) และคณะผู้ดูแลชาวไทย ภายใต้กรอบพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และมาตรฐานความมั่นคงปลอดภัยสารสนเทศระดับสากล
- **มาตรฐานการเข้ารหัสและสมุดบัญชีหลักฐาน (Evidence Ledger V25)**: บล็อกจำนวน 14,902 รายการถูกผูกโยงผ่าน SHA-256 Merkle Root '909ab814479844d8a14816bed34cdbb07528e18501da86fc4691763a43fa4c68' โดยมีอัตราความคลาดเคลื่อน SSoT Mutation = 0
- **คำแนะนำ**: ผู้ใช้สามารถค้นหาข้อกฎหมายเฉพาะเจาะจง เช่น "PDPA", "NCSA Cyber Act", "NIST FIPS 203 PQC", หรือ "ETDA Electronic Signature" เพื่อดูรายละเอียดมาตราและมาตรฐานอ้างอิง`;
    citations = [
      { title: 'สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (ETDA)', uri: 'https://www.etda.or.th' },
      { title: 'NIST Post-Quantum Cryptography Program', uri: 'https://csrc.nist.gov' },
    ];
  }

  return res.json({
    query,
    source: 'Sovereign Knowledge Engine & Legal Standards Index',
    answer,
    citations,
    timestamp: new Date().toISOString(),
  });
});

// Vite Middleware for Development / Static serving for Production
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZYRQUEN Ω∞ Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupApp();
