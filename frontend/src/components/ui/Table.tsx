import React from 'react';
import { clsx } from 'clsx';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table = ({ headers, children }: TableProps) => (
  <div className="w-full overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-950/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800/50"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {children}
        </tbody>
      </table>
    </div>
  </div>
);

export const TableRow = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <tr className={clsx("transition-colors duration-200 hover:bg-slate-800/40 group", className)}>
    {children}
  </tr>
);

export const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <td className={clsx("px-6 py-4 text-sm text-slate-300", className)}>
    {children}
  </td>
);
