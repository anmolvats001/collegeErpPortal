import React, { createContext, useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { IS_PREVIEW_MODE, MOCK_COLLEGE, MOCK_COLLEGES, MOCK_COLLEGE_MODULES } from '../utils/mockData';
import { moduleService } from '../services/moduleService';
import { collegeService } from '../services/collegeService';

export const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [activeCollegeId, setActiveCollegeId] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.COLLEGE_ID) || (IS_PREVIEW_MODE ? MOCK_COLLEGE.id : '')
  );
  const [activeCollegeName, setActiveCollegeName] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.COLLEGE_NAME) || (IS_PREVIEW_MODE ? MOCK_COLLEGE.name : '')
  );
  const [activeCollegeCode, setActiveCollegeCode] = useState(() =>
    localStorage.getItem('erp_college_code') || (IS_PREVIEW_MODE ? MOCK_COLLEGE.code : '')
  );
  const [availableColleges, setAvailableColleges] = useState(() => (IS_PREVIEW_MODE ? MOCK_COLLEGES : []));
  const [isCollegesLoading, setIsCollegesLoading] = useState(false);

  const [activeModules, setActiveModules] = useState(() => {
    const initialId = localStorage.getItem(STORAGE_KEYS.COLLEGE_ID) || (IS_PREVIEW_MODE ? MOCK_COLLEGE.id : '');
    return (IS_PREVIEW_MODE && MOCK_COLLEGE_MODULES[initialId]) || ['CORE', 'CLASS', 'ATTENDANCE', 'ADMISSION', 'FEE', 'NOTIFICATION', 'FILES'];
  });
  const [isModulesLoading, setIsModulesLoading] = useState(false);

  // Fetch all colleges registered in the backend
  const fetchAvailableColleges = useCallback(async () => {
    setIsCollegesLoading(true);
    try {
      const resp = await collegeService.getAllColleges(0, 100);
      const list = resp?.colleges?.content || resp?.content || (Array.isArray(resp) ? resp : null);
      if (Array.isArray(list) && list.length > 0) {
        if (IS_PREVIEW_MODE) {
          const existingIds = new Set(list.map((c) => c.collegeId || c.id));
          const combined = [...list, ...MOCK_COLLEGES.filter((m) => !existingIds.has(m.collegeId))];
          setAvailableColleges(combined);
        } else {
          setAvailableColleges(list);
        }
      } else {
        setAvailableColleges(IS_PREVIEW_MODE ? MOCK_COLLEGES : []);
      }
    } catch {
      setAvailableColleges(IS_PREVIEW_MODE ? MOCK_COLLEGES : []);
    } finally {
      setIsCollegesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailableColleges();
  }, [fetchAvailableColleges]);

  const fetchCollegeModules = useCallback(async (collegeId) => {
    if (!collegeId) return;
    setIsModulesLoading(true);
    try {
      const resp = await moduleService.getModulesOfCollege(collegeId);
      if (resp?.modules && Array.isArray(resp.modules) && resp.modules.length > 0) {
        setActiveModules(resp.modules.map((m) => m.moduleCode));
      } else if (IS_PREVIEW_MODE && MOCK_COLLEGE_MODULES[collegeId]) {
        setActiveModules(MOCK_COLLEGE_MODULES[collegeId]);
      } else {
        // Fallback default modules so user is never locked out of college capabilities
        setActiveModules(['CORE', 'CLASS', 'ATTENDANCE', 'ADMISSION', 'FEE', 'NOTIFICATION', 'FILES']);
      }
    } catch {
      if (IS_PREVIEW_MODE && MOCK_COLLEGE_MODULES[collegeId]) {
        setActiveModules(MOCK_COLLEGE_MODULES[collegeId]);
      } else {
        setActiveModules(['CORE', 'CLASS', 'ATTENDANCE', 'ADMISSION', 'FEE', 'NOTIFICATION', 'FILES']);
      }
    } finally {
      setIsModulesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeCollegeId) {
      fetchCollegeModules(activeCollegeId);
    }
  }, [activeCollegeId, fetchCollegeModules]);

  const switchCollege = useCallback((collegeOrId, maybeName = '', maybeCode = '') => {
    let id = '';
    let name = '';
    let code = '';

    if (typeof collegeOrId === 'object' && collegeOrId !== null) {
      id = collegeOrId.collegeId || collegeOrId.id || '';
      name = collegeOrId.collegeName || collegeOrId.name || '';
      code = collegeOrId.collegeCode || collegeOrId.code || '';
    } else {
      id = collegeOrId || '';
      name = maybeName || '';
      code = maybeCode || '';
    }

    if (!id) return;

    localStorage.setItem(STORAGE_KEYS.COLLEGE_ID, id);
    if (name) localStorage.setItem(STORAGE_KEYS.COLLEGE_NAME, name);
    if (code) localStorage.setItem('erp_college_code', code);

    setActiveCollegeId(id);
    setActiveCollegeName(name);
    setActiveCollegeCode(code);
    fetchCollegeModules(id);
  }, [fetchCollegeModules]);

  const clearActiveCollege = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.COLLEGE_ID);
    localStorage.removeItem(STORAGE_KEYS.COLLEGE_NAME);
    localStorage.removeItem('erp_college_code');
    setActiveCollegeId(null);
    setActiveCollegeName('');
    setActiveCollegeCode('');
    setActiveModules(['CORE']);
  }, []);

  const hasModule = useCallback(
    (moduleCode) => {
      if (!moduleCode || moduleCode === 'CORE') return true;
      return activeModules.includes(moduleCode.toUpperCase());
    },
    [activeModules]
  );

  const currentCollege = {
    id: activeCollegeId,
    collegeId: activeCollegeId,
    name: activeCollegeName,
    collegeName: activeCollegeName,
    code: activeCollegeCode,
    collegeCode: activeCollegeCode,
  };

  return (
    <TenantContext.Provider
      value={{
        activeCollegeId,
        collegeId: activeCollegeId,
        currentCollegeId: activeCollegeId,
        activeCollegeName,
        collegeName: activeCollegeName,
        activeCollegeCode,
        collegeCode: activeCollegeCode,
        currentCollege,
        availableColleges,
        isCollegesLoading,
        activeModules,
        hasModule,
        switchCollege,
        selectCollege: switchCollege,
        clearActiveCollege,
        refreshColleges: fetchAvailableColleges,
        refreshModules: () => fetchCollegeModules(activeCollegeId),
        isModulesLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

