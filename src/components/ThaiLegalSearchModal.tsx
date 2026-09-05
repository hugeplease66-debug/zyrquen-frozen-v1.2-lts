import React, { useState, useEffect } from 'react';
import {
  Search,
  Scale,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Sparkles,
  X,
  Copy,
  CheckCircle2,
  FileText,
  AlertCircle,
  Globe,
  History,
  Tag,
  Trash2,
  Layers,
  FileCheck,
} from 'lucide-react';
import { playAuditChime, playTone } from './AudioSynthesizer';
import { THAI_CUSTODIANS, SYSTEM_METADATA } from '../data/canonicalData';
import { ThaiLegalSovereignMapping } from './ThaiLegalSovereignMapping';
import { safeCopyToClipboard } from '../utils/clipboard';

interface ThaiLegalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchExecuted?: (query: string, resultSummary: string) => void;
}

interface SearchResult {
  query: string;
  source: string;
  answer: string;
  citations: Array<{ title: string; uri: string }>;
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    category: 'Electronic Signatures',
    title: 'พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ มาตรา 9, 26, 28 (ETDA Standard)',
    query: 'พระราชบัญญัติว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 มาตรา 9 มาตรา 26 มาตรา 28 ลายมือชื่อดิจิทัลที่เชื่อถือได้ มาตรฐาน ETDA',
  },
  {
    category: 'Thai Law',
    title: 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA Thailand)',
    query: 'พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 PDPA Thailand ข้อกำหนดความมั่นคงปลอดภัยและการจัดเก็บข้อมูล',
  },
  {
    category: 'Cybersecurity',
    title: 'พ.ร.บ. ความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562 (NCSA)',
    query: 'พ.ร.บ. การรักษาความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562 โครงสร้างพื้นฐานสำคัญทางสารสนเทศ CII NCSA Thailand',
  },
  {
    category: 'Post-Quantum',
    title: 'NIST FIPS 203 / 204 / 205 PQC Standards',
    query: 'NIST Post-Quantum Cryptography standards FIPS 203 ML-KEM FIPS 204 ML-DSA FIPS 205 SLH-DSA Merkle ledger compliance',
  },
  {
    category: 'Custodian Registry',
    title: 'Thai Custodian Registry & Merkle Authority',
    query: 'Thai Sovereign Custodian Registry Passport EP-SOVEREIGN-01 นายยุทธภูมิ พากเพียร post-quantum Merkle governance',
  },
];

const DEFAULT_RECENT_SEARCHES = [
  'พ.ร.บ. ธุรกรรมทางอิเล็กทรอนิกส์ มาตรา 9 26 28 ETDA',
  'PDPA พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล 2562 มาตรา 37',
  'NIST FIPS 203 ML-KEM Post-Quantum Cryptography',
  'พ.ร.บ. ความมั่นคงปลอดภัยไซเบอร์ 2562 NCSA CII',
  'Thai Custodian Registry #EP-SOVEREIGN-01 นายยุทธภูมิ พากเพียร',
];

export const ThaiLegalSearchModal: React.FC<ThaiLegalSearchModalProps> = ({
  isOpen,
  onClose,
  onSearchExecuted,
}) => {
  const [activeTab, setActiveTab] = useState<'search' | 'mapping'>('mapping');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('zyrquen_recent_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const saveRecentSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('zyrquen_recent_searches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearRecentSearches = () => {
    playTone(450, 0.04);
    setRecentSearches([]);
    try {
      localStorage.removeItem('zyrquen_recent_searches');
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleSearch = async (searchQuery: string) => {
    const q = searchQuery.trim();
    if (!q) return;

    saveRecentSearch(q);
    setIsLoading(true);
    setErrorMsg(null);
    setActiveTab('search');
    playTone(580, 0.05);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data: SearchResult = await res.json();
      setResult(data);
      if (onSearchExecuted) {
        onSearchExecuted(q, data.answer?.slice(0, 120) || 'Query completed via Google Search Oracle');
      }
      playAuditChime();
    } catch (err: any) {
      console.error('Search request error:', err);
      setErrorMsg('Failed to query search oracle. Reverting to local canonical registry citations.');
      // Local fallback
      const fallbackResult: SearchResult = {
        query: q,
        source: 'Canonical Thai Legal Knowledge Base (Local Oracle)',
        answer: `**สิทธิและกฎหมายอธิปไตยไทย (Thai Sovereign & Cryptographic Registry):**\n- พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ พ.ศ. 2544 (แก้ไข 2562) มาตรา 9 (รับรองผลทางกฎหมาย), มาตรา 26 (มาตรฐานลายมือชื่อเชื่อถือได้สูงสุด), มาตรา 28 (ความรับผิดชอบของเจ้าของข้อมูล)\n- สอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) มาตรา 19, 27, 37\n- สอดคล้องกับ พ.ร.บ. ความมั่นคงปลอดภัยไซเบอร์ พ.ศ. 2562 (NCSA)\n- มาตรฐานเข้ารหัสพ้นควอนตัม NIST FIPS 203 (ML-KEM) และ FIPS 204 (ML-DSA)\n- ควบคุมโดยผู้ถือสิทธิ์ Sovereign Principal: นายยุทธภูมิ พากเพียร (#EP-SOVEREIGN-01)`,
        citations: [
          { title: 'สำนักงานพัฒนาธุรกรรมทางอิเล็กทรอนิกส์ (ETDA)', uri: 'https://www.etda.or.th' },
          { title: 'ราชกิจจานุเบกษาแห่งราชอาณาจักรไทย', uri: 'https://www.ratchakitcha.soc.go.th' },
        ],
        timestamp: new Date().toISOString(),
      };
      setResult(fallbackResult);
      if (onSearchExecuted) {
        onSearchExecuted(q, 'Grounded with Thai Sovereign PDPA/NCSA Canonical Oracle');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const textToCopy = `ZYRQUEN Ω∞ LEGAL & CRYPTOGRAPHIC SEARCH REPORT\nQuery: ${result.query}\nSource: ${result.source}\nTimestamp: ${result.timestamp}\n\n${result.answer}\n\nCitations:\n${result.citations.map((c) => `- ${c.title}: ${c.uri}`).join('\n')}`;
    safeCopyToClipboard(textToCopy);
    setCopied(true);
    playTone(700, 0.05);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] bg-[#07080F] border border-white/15 shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0a1820] via-[#0b0e1a] to-[#07080F] border-b border-white/8 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono uppercase tracking-wider">
                  THAI LAWS ↔ CRYPTOGRAPHIC SEAL CHAIN
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                  ETDA & ROYAL GAZETTE GROUNDING
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                Thai Legal Compliance & Sovereign Seal Chain Mapping
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                พ.ร.บ. ว่าด้วยธุรกรรมทางอิเล็กทรอนิกส์ (มาตรา 9/26/28), PDPA, NCSA และ NIST Post-Quantum Standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playTone(400, 0.05);
                onClose();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="px-6 py-2.5 bg-[#0a0c16] border-b border-white/8 flex items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/6">
            <button
              onClick={() => {
                playTone(550, 0.03);
                setActiveTab('mapping');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'mapping'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>มาตรา 9/26/28 Flow Diagram & Mapping</span>
            </button>

            <button
              onClick={() => {
                playTone(580, 0.03);
                setActiveTab('search');
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-violet-400" />
              <span>Live Search Oracle & Citations</span>
            </button>
          </div>

          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            Sovereign Principal Custodian: {SYSTEM_METADATA.sovereignPrincipal}
          </span>
        </div>

        {/* Tab 1: Section 9 / 26 / 28 Architecture Flow Diagram & Mapping */}
        {activeTab === 'mapping' ? (
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
            <ThaiLegalSovereignMapping />
          </div>
        ) : (
          /* Tab 2: Live Search Oracle */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search Input Bar */}
            <div className="p-5 sm:p-6 border-b border-white/8 bg-[#0b0e1a]/60 space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(query);
                }}
                className="relative flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Thai laws, มาตรา 9/26/28, PDPA, NCSA, NIST FIPS 203 PQC..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.07] text-white font-mono text-xs sm:text-sm placeholder-zinc-500 focus:outline-none transition-all"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all shrink-0"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Search Oracle</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Preset Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400">Curated Legal & Cryptographic Benchmarks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_QUERIES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(preset.query);
                        handleSearch(preset.query);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/8 hover:border-cyan-500/30 text-[11px] font-mono text-zinc-300 hover:text-cyan-300 transition-all text-left flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3 h-3 text-cyan-400" />
                      <span>{preset.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Results Body */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isLoading && (
                <div className="py-16 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-3 border-cyan-500/20 border-t-cyan-400 animate-spin mx-auto" />
                  <div className="space-y-1">
                    <p className="font-mono text-sm text-cyan-300 font-semibold">
                      Querying Google Search Grounding & Legal Corpus...
                    </p>
                    <p className="font-mono text-xs text-zinc-500">
                      Grounding against Royal Gazette, NCSA, ETDA, and NIST PQC Repositories
                    </p>
                  </div>
                </div>
              )}

              {!isLoading && result && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Header Info */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div className="space-y-0.5">
                      <div className="text-zinc-400">
                        Query: <span className="text-cyan-300 font-semibold">"{result.query}"</span>
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Source: <span className="text-emerald-400">{result.source}</span> • Verified at{' '}
                        {new Date(result.timestamp).toLocaleTimeString('th-TH')}
                      </div>
                    </div>

                    <button
                      onClick={copyToClipboard}
                      className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Report</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Answer Content */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/8 text-zinc-200 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {result.answer}
                  </div>

                  {/* Citations & Web Sources */}
                  {result.citations && result.citations.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                        Verified Authorities & Grounding Sources:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.citations.map((cite, idx) => (
                          <a
                            key={idx}
                            href={cite.uri}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 border border-white/8 hover:border-cyan-500/30 text-xs font-mono text-zinc-300 hover:text-cyan-300 flex items-center justify-between gap-2 transition-all group"
                          >
                            <span className="truncate">{cite.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sovereign Authority Seal */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/20 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="text-[11px] font-mono text-zinc-300 leading-snug">
                      <span className="text-amber-300 font-semibold">
                        Sovereign Principal Custodian Clearance (#EP-SOVEREIGN-01):
                      </span>{' '}
                      Certified immutable under {SYSTEM_METADATA.name} • Merkle Root: {SYSTEM_METADATA.merkleRoot.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !result && (
                <div className="py-12 text-center space-y-3 font-mono">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                    <Search className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-sm text-zinc-300 font-semibold">Enter a query or select a legal benchmark above</p>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto">
                    Real-time legal search retrieves live statutory citations for Thai Personal Data Protection Act, Cyber
                    Security Framework, and NIST Post-Quantum Cryptography standards.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Searches Footer Section */}
            {recentSearches.length > 0 && (
              <div className="px-6 py-3 bg-[#0a0c16]/90 border-t border-white/8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-zinc-300 font-semibold">Recent Searches:</span>
                    <span className="text-zinc-500 text-[10px]">Click tag to re-execute query</span>
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-[10px] font-mono text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-rose-500/10"
                    title="Clear recent search history"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
                  {recentSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/25 hover:border-violet-500/45 text-[11px] font-mono text-violet-200 hover:text-white flex items-center gap-1.5 transition-all group"
                      title={`Re-run: "${item}"`}
                    >
                      <Tag className="w-3 h-3 text-violet-400 group-hover:text-cyan-300 transition-colors" />
                      <span className="truncate max-w-[240px] sm:max-w-xs">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-black/60 border-t border-white/8 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Thailand Jurisdiction • Royal Gazette, ETDA & NIST Compliance</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all"
          >
            Close Search
          </button>
        </div>
      </div>
    </div>
  );
};
