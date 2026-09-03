#!/bin/bash
find src/components -type f -name "*.tsx" | while read -r file; do
  sed -i 's|bg-\\[#0b0e1a\\]/85 border border-white/8|bg-gradient-to-br from-[#070914]/95 via-[#0b0e1e]/90 to-[#070914]/95 border border-cyan-500/20 shadow-[0_8px_30px_-10px_rgba(6,182,212,0.15)]|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/75 border border-white/8|bg-gradient-to-br from-[#070914]/95 via-[#0b0e1e]/90 to-[#070914]/95 border border-cyan-500/20 shadow-[0_8px_30px_-10px_rgba(6,182,212,0.15)]|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/70 border border-white/8|bg-gradient-to-br from-[#070914]/90 via-[#0b0e1e]/80 to-[#070914]/90 border border-cyan-500/20 shadow-[0_8px_30px_-10px_rgba(6,182,212,0.1)]|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/85 border border-cyan-500/20|bg-gradient-to-br from-[#070914]/95 via-[#0b0e1e]/90 to-[#070914]/95 border border-cyan-500/20 shadow-[0_8px_30px_-10px_rgba(6,182,212,0.15)]|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/60|bg-[#070914]/60|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/70|bg-[#070914]/70|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/80|bg-[#070914]/80|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]/85|bg-[#070914]/85|g' "$file"
  sed -i 's|bg-\\[#0b0e1a\\]|bg-[#070914]|g' "$file"
done
