import React, { useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Badge } from './Badge';
import { useTenant } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';
import { Building2, Search, Check, MapPin, Globe, Loader2 } from 'lucide-react';

export const TenantSelectorModal = ({ isOpen, onClose }) => {
  const { activeCollegeId, switchCollege, clearActiveCollege, availableColleges, isCollegesLoading } = useTenant();
  const { isMainAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const collegesList = Array.isArray(availableColleges) && availableColleges.length > 0 ? availableColleges : [];

  const filtered = collegesList.filter((c) => {
    const q = searchTerm.toLowerCase();
    const name = (c.collegeName || c.name || '').toLowerCase();
    const code = (c.collegeCode || c.code || '').toLowerCase();
    const university = (c.universityName || '').toLowerCase();
    const city = (c.collegeCity || '').toLowerCase();
    return name.includes(q) || code.includes(q) || university.includes(q) || city.includes(q);
  });

  const handleSelect = (college) => {
    const id = college.collegeId || college.id;
    const name = college.collegeName || college.name;
    const code = college.collegeCode || college.code;
    switchCollege(id, name, code);
    onClose();
  };

  const handleClear = () => {
    clearActiveCollege();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Switch Institutional Campus"
      subtitle="Select an affiliated autonomous college to filter tenant data & permissions."
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        <Input
          id="tenantModalSearch"
          type="text"
          placeholder="Search by college name, code, university or city..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />

        {isMainAdmin && (
          <div
            onClick={handleClear}
            className={`pt-2 pb-2 px-3 rounded cursor-pointer transition flex items-center justify-between gap-3 border ${
              !activeCollegeId
                ? 'bg-blue-50/90 border-blue-300'
                : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                  !activeCollegeId ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                <Globe size={16} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  Platform Administration (All Colleges)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Global view without scoping to a single college
                </p>
              </div>
            </div>
            {!activeCollegeId && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                <Check size={12} /> Active
              </span>
            )}
          </div>
        )}

        <div className="max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-100">
          {isCollegesLoading && collegesList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin text-blue-800" />
              <span>Loading institutional directory...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching colleges found for "{searchTerm}".
            </div>
          ) : (
            filtered.map((college) => {
              const collegeKey = college.collegeId || college.id;
              const isSelected = activeCollegeId === collegeKey;
              const code = college.collegeCode || college.code || 'CL';
              const name = college.collegeName || college.name || 'Unnamed Institution';
              const city = college.collegeCity || '';

              return (
                <div
                  key={collegeKey}
                  onClick={() => handleSelect(college)}
                  className={`pt-2 pb-2 px-3 rounded cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border border-blue-300'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-blue-800 text-white'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {code.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                        <span>Code: {code}</span>
                        {city && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin size={10} />
                              {city}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        <Check size={12} /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 hover:text-slate-800">
                        Select
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TenantSelectorModal;

