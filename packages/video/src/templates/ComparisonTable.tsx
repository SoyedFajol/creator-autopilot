import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandColors, BrandFonts } from '@creator-autopilot/core';

export interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  highlightColIndex?: number;
  colors: BrandColors;
  fonts: BrandFonts;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  headers,
  rows,
  highlightColIndex = 1,
  colors,
  fonts,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        fontFamily: fonts.body,
        maxWidth: '1100px',
        margin: 'auto',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: `3px solid ${colors.primary}` }}>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: '16px 20px',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  fontFamily: fonts.heading,
                  color: i === highlightColIndex ? colors.primary : colors.text,
                  backgroundColor: i === highlightColIndex ? `${colors.primary}10` : 'transparent',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  style={{
                    padding: '16px 20px',
                    fontSize: '24px',
                    fontWeight: cIdx === highlightColIndex ? 700 : 500,
                    color: cIdx === highlightColIndex ? colors.primary : colors.text,
                    backgroundColor: cIdx === highlightColIndex ? `${colors.primary}08` : 'transparent',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
