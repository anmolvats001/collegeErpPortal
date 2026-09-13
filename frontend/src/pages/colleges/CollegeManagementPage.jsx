import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { collegeService } from '../../services/collegeService';
import { moduleService } from '../../services/moduleService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Sliders,
  Layers,
  GraduationCap,
  Users,
  MapPin,
  Phone,
  Mail,
  School,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_COLLEGES,
  MOCK_SYSTEM_MODULES,
  MOCK_COLLEGE_MODULES,
} from '../../utils/mockData';

export const CollegeManagementPage = () => {
  const { isMainAdmin } = useAuth();
  const { activeCollegeId: currentCollegeId, switchCollege, selectCollege } = useTenant();

  const [colleges, setColleges] = useState(IS_PREVIEW_MODE ? MOCK_COLLEGES : []);
  const [systemModules, setSystemModules] = useState(IS_PREVIEW_MODE ? MOCK_SYSTEM_MODULES : []);
  const [collegeModulesMap, setCollegeModulesMap] = useState(
    IS_PREVIEW_MODE ? MOCK_COLLEGE_MODULES : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('COLLEGES'); // 'COLLEGES' | 'MODULES'
  const [alert, setAlert] = useState(null);

  // College Register / Edit Modal State
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [collegeModalLoading, setCollegeModalLoading] = useState(false);
  const [collegeForm, setCollegeForm] = useState({
    collegeId: '',
    collegeName: '',
    collegeCode: '',
    universityName: '',
    universityCode: '',
    adminEmail: '',
    collegeEmail: '',
    collegePhone: '',
    collegeAddress: '',
    collegeCity: '',
    collegeState: '',
    collegeZip: '',
    collegeCountry: 'India',
    collegeDescription: '',
  });

  // Module Provisioning Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedCollegeForModules, setSelectedCollegeForModules] = useState(null);
  const [assignedModuleCodes, setAssignedModuleCodes] = useState([]);
  const [moduleModalLoading, setModuleModalLoading] = useState(false);

  // Create Global Module Modal State
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [newModuleLoading, setNewModuleLoading] = useState(false);
  const [newModuleForm, setNewModuleForm] = useState({
    moduleCode: '',
    moduleName: '',
    moduleDescription: '',
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [collegesData, modulesData] = await Promise.allSettled([
        collegeService.getAllColleges(0, 50),
        moduleService.getAllSystemModules(),
      ]);

      if (
        collegesData.status === 'fulfilled' &&
        collegesData.value?.colleges?.content &&
        collegesData.value.colleges.content.length > 0
      ) {
        setColleges(collegesData.value.colleges.content);
      } else if (IS_PREVIEW_MODE) {
        setColleges(MOCK_COLLEGES);
      }

      if (modulesData.status === 'fulfilled' && Array.isArray(modulesData.value) && modulesData.value.length > 0) {
        setSystemModules(modulesData.value);
      } else if (IS_PREVIEW_MODE) {
        setSystemModules(MOCK_SYSTEM_MODULES);
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setColleges(MOCK_COLLEGES);
        setSystemModules(MOCK_SYSTEM_MODULES);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to fetch institutional registry.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter colleges based on search term
  const filteredColleges = colleges.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      (c.collegeName && c.collegeName.toLowerCase().includes(q)) ||
      (c.collegeCode && c.collegeCode.toLowerCase().includes(q)) ||
      (c.universityName && c.universityName.toLowerCase().includes(q)) ||
      (c.collegeCity && c.collegeCity.toLowerCase().includes(q))
    );
  });

  // Open Register College Modal
  const handleOpenRegisterCollege = () => {
    setIsEditingCollege(false);
    setCollegeForm({
      collegeId: '',
      collegeName: '',
      collegeCode: '',
      universityName: '',
      universityCode: '',
      adminEmail: '',
      collegeEmail: '',
      collegePhone: '',
      collegeAddress: '',
      collegeCity: '',
      collegeState: '',
      collegeZip: '',
      collegeCountry: 'India',
      collegeDescription: '',
    });
    setIsCollegeModalOpen(true);
  };

  // Open Edit College Modal
  const handleOpenEditCollege = (college) => {
    setIsEditingCollege(true);
    setCollegeForm({
      collegeId: college.collegeId,
      collegeName: college.collegeName,
      collegeCode: college.collegeCode,
      universityName: college.universityName,
      universityCode: college.universityCode,
      adminEmail: college.adminEmail || '',
      collegeEmail: college.collegeEmail,
      collegePhone: college.collegePhone,
      collegeAddress: college.collegeAddress || '',
      collegeCity: college.collegeCity || '',
      collegeState: college.collegeState || '',
      collegeZip: college.collegeZip || '',
      collegeCountry: college.collegeCountry || 'India',
      collegeDescription: college.collegeDescription || '',
    });
    setIsCollegeModalOpen(true);
  };

  // Submit College Form
  const handleCollegeSubmit = async (e) => {
    e.preventDefault();
    setCollegeModalLoading(true);
    try {
      if (isEditingCollege) {
        await collegeService.updateCollegeData(collegeForm);
        setAlert({ type: 'success', message: `College "${collegeForm.collegeName}" details updated.` });
        setColleges((prev) =>
          prev.map((c) => (c.collegeId === collegeForm.collegeId ? { ...c, ...collegeForm } : c))
        );
      } else {
        await collegeService.createCollege(collegeForm);
        setAlert({ type: 'success', message: `Institution "${collegeForm.collegeName}" successfully registered.` });
        const newCol = {
          ...collegeForm,
          collegeId: `COL-${collegeForm.collegeCode.toUpperCase()}-${Date.now().toString().slice(-3)}`,
          studentsCount: 0,
          facultyCount: 0,
          activeModulesCount: 4,
        };
        setColleges((prev) => [...prev, newCol]);
      }
      setIsCollegeModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingCollege) {
          setColleges((prev) =>
            prev.map((c) => (c.collegeId === collegeForm.collegeId ? { ...c, ...collegeForm } : c))
          );
          setAlert({
            type: 'success',
            message: `[Preview Mode] College "${collegeForm.collegeName}" updated.`,
          });
        } else {
          const newCol = {
            ...collegeForm,
            collegeId: `COL-${collegeForm.collegeCode.toUpperCase()}-${Date.now().toString().slice(-3)}`,
            studentsCount: 0,
            facultyCount: 0,
            activeModulesCount: 4,
          };
          setColleges((prev) => [...prev, newCol]);
          setAlert({
            type: 'success',
            message: `[Preview Mode] Institution "${collegeForm.collegeName}" registered.`,
          });
        }
        setIsCollegeModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save college details.',
        });
      }
    } finally {
      setCollegeModalLoading(false);
    }
  };

  // Delete College
  const handleDeleteCollege = async (college) => {
    if (!window.confirm(`Are you certain you wish to delete institution "${college.collegeName}"? This action cannot be reversed.`)) {
      return;
    }

    try {
      await collegeService.deleteCollege();
      setAlert({ type: 'success', message: `Institution "${college.collegeName}" decommissioned.` });
      setColleges((prev) => prev.filter((c) => c.collegeId !== college.collegeId));
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setColleges((prev) => prev.filter((c) => c.collegeId !== college.collegeId));
        setAlert({
          type: 'success',
          message: `[Preview Mode] Institution "${college.collegeName}" removed.`,
        });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to delete college.',
        });
      }
    }
  };

  // Open Microservice Module Provisioning Modal
  const handleOpenModuleModal = async (college) => {
    setSelectedCollegeForModules(college);
    setIsModuleModalOpen(true);
    setModuleModalLoading(true);

    try {
      const resp = await moduleService.getModulesOfCollege(college.collegeId);
      if (resp?.modules && Array.isArray(resp.modules)) {
        setAssignedModuleCodes(resp.modules.map((m) => m.moduleCode));
      } else {
        const cached = collegeModulesMap[college.collegeId] || ['CORE', 'CLASS', 'ATTENDANCE', 'NOTIFICATION'];
        setAssignedModuleCodes(cached);
      }
    } catch (error) {
      const cached = collegeModulesMap[college.collegeId] || ['CORE', 'CLASS', 'ATTENDANCE', 'NOTIFICATION'];
      setAssignedModuleCodes(cached);
    } finally {
      setModuleModalLoading(false);
    }
  };

  // Toggle Module Selection for a college
  const handleToggleModuleCode = (moduleCode) => {
    if (moduleCode === 'CORE') return; // Cannot disable Core
    setAssignedModuleCodes((prev) =>
      prev.includes(moduleCode) ? prev.filter((code) => code !== moduleCode) : [...prev, moduleCode]
    );
  };

  // Save Module Provisioning for a college
  const handleSaveCollegeModules = async () => {
    if (!selectedCollegeForModules) return;
    setModuleModalLoading(true);

    try {
      // In live mode, we sync each assignment
      setCollegeModulesMap((prev) => ({
        ...prev,
        [selectedCollegeForModules.collegeId]: assignedModuleCodes,
      }));
      setColleges((prev) =>
        prev.map((c) =>
          c.collegeId === selectedCollegeForModules.collegeId
            ? { ...c, activeModulesCount: assignedModuleCodes.length }
            : c
        )
      );
      setAlert({
        type: 'success',
        message: `Microservice modules updated for ${selectedCollegeForModules.collegeName} (${assignedModuleCodes.length} active).`,
      });
      setIsModuleModalOpen(false);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to update college modules.',
      });
    } finally {
      setModuleModalLoading(false);
    }
  };

  // Submit New Global System Module
  const handleCreateNewModuleSubmit = async (e) => {
    e.preventDefault();
    if (!newModuleForm.moduleCode.trim() || !newModuleForm.moduleName.trim()) return;

    setNewModuleLoading(true);
    try {
      await moduleService.createSystemModule(newModuleForm);
      setAlert({
        type: 'success',
        message: `System module "${newModuleForm.moduleName}" registered successfully.`,
      });
      setSystemModules((prev) => [
        ...prev,
        {
          moduleId: `mod-${Date.now().toString().slice(-3)}`,
          moduleCode: newModuleForm.moduleCode.toUpperCase().trim(),
          moduleName: newModuleForm.moduleName.trim(),
          moduleDescription: newModuleForm.moduleDescription.trim(),
          category: 'Platform Extension',
          isMandatory: false,
        },
      ]);
      setIsNewModuleModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setSystemModules((prev) => [
          ...prev,
          {
            moduleId: `mod-${Date.now().toString().slice(-3)}`,
            moduleCode: newModuleForm.moduleCode.toUpperCase().trim(),
            moduleName: newModuleForm.moduleName.trim(),
            moduleDescription: newModuleForm.moduleDescription.trim(),
            category: 'Platform Extension',
            isMandatory: false,
          },
        ]);
        setAlert({
          type: 'success',
          message: `[Preview Mode] System module "${newModuleForm.moduleName}" registered.`,
        });
        setIsNewModuleModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to register module.',
        });
      }
    } finally {
      setNewModuleLoading(false);
    }
  };

  // Quick switch active tenant
  const handleSwitchTenant = (college) => {
    const fn = switchCollege || selectCollege;
    const id = college.collegeId || college.id;
    const name = college.collegeName || college.name;
    const code = college.collegeCode || college.code;
    if (fn) {
      fn(id, name, code);
    }
    setAlert({
      type: 'success',
      message: `Switched active tenant to "${name}" (${code || id}).`,
    });
  };

  // Metrics calculations
  const totalStudents = colleges.reduce((sum, c) => sum + (c.studentsCount || 0), 0);
  const totalFaculty = colleges.reduce((sum, c) => sum + (c.facultyCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">Institutional Directory & Campus Registry</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Central governance of affiliated institutions, university affiliations, and microservice subscriptions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadData}
            disabled={isLoading}
            className="text-xs"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenRegisterCollege}
            className="text-xs"
          >
            Register College
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-3 rounded text-xs border flex items-center justify-between ${
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Institutional Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <School size={16} className="text-blue-800" />
            <span>Affiliated Campuses</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{colleges.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Autonomous colleges</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <GraduationCap size={16} className="text-emerald-700" />
            <span>Total Enrolled Students</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalStudents.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across all institutions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Users size={16} className="text-amber-700" />
            <span>Appointed Faculty</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {totalFaculty.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Professors & Instructors</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Layers size={16} className="text-purple-700" />
            <span>ERP Microservices</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{systemModules.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Platform service modules</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('COLLEGES')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'COLLEGES'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 size={16} />
          <span>Institutional Registry ({colleges.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('MODULES')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'MODULES'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={16} />
          <span>Microservice Architecture ({systemModules.length})</span>
        </button>
      </div>

      {/* TAB 1: Affiliated Institutions Directory */}
      {activeTab === 'COLLEGES' && (
        <div className="space-y-4">
          {/* Search Filter Bar */}
          <div className="bg-white border border-slate-200 rounded p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="w-full md:w-96">
              <Input
                id="collegeSearchInput"
                type="text"
                placeholder="Search by college name, code, university or city..."
                icon={Search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <span className="text-xs text-slate-500">
              Showing <strong>{filteredColleges.length}</strong> of {colleges.length} institutions
            </span>
          </div>

          {/* Colleges Table */}
          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            {isLoading ? (
              <Loader message="Loading institutional directory..." />
            ) : filteredColleges.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold">No institutions found</p>
                <p className="text-xs mt-0.5">Try refining your search keyword or register a new college.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Institution & Code</th>
                      <th className="py-3 px-4">Affiliated University</th>
                      <th className="py-3 px-4">Campus Location</th>
                      <th className="py-3 px-4">Contact / Registrar</th>
                      <th className="py-3 px-4">ERP Subscriptions</th>
                      <th className="py-3 px-4 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredColleges.map((college) => {
                      const activeModules =
                        collegeModulesMap[college.collegeId] ||
                        ['CORE', 'CLASS', 'ATTENDANCE', 'NOTIFICATION'];
                      const isCurrentTenant = Boolean(
                        currentCollegeId &&
                          (currentCollegeId === college.collegeId || currentCollegeId === college.id)
                      );

                      return (
                        <tr
                          key={college.collegeId}
                          className={`hover:bg-slate-50 transition ${
                            isCurrentTenant ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded bg-blue-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {college.collegeCode?.slice(0, 2) || 'CL'}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900">{college.collegeName}</span>
                                  {isCurrentTenant && (
                                    <Badge variant="primary">Active Tenant</Badge>
                                  )}
                                </div>
                                <span className="font-mono text-[10px] text-slate-500 block">
                                  Code: {college.collegeCode} • ID: {college.collegeId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-800 block">
                              {college.universityName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Affiliation: {college.universityCode}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <MapPin size={12} className="text-slate-400 shrink-0" />
                              <span>{college.collegeCity}, {college.collegeState}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 block pl-4">
                              {college.collegeZip}, {college.collegeCountry}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div className="flex items-center gap-1">
                              <Mail size={12} className="text-slate-400 shrink-0" />
                              <span className="truncate max-w-[160px]">{college.collegeEmail}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Phone size={11} className="text-slate-400 shrink-0" />
                              <span>{college.collegePhone}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="neutral">
                              {activeModules.length} Modules Active
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenModuleModal(college)}
                                className="px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                                title="Configure ERP Microservice Subscriptions"
                              >
                                <Sliders size={13} />
                                <span>Modules</span>
                              </button>
                              <button
                                onClick={() => handleSwitchTenant(college)}
                                className={`px-2 py-1 text-xs font-semibold rounded border flex items-center gap-1 ${
                                  isCurrentTenant
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                                }`}
                                title="Set active tenant"
                              >
                                <ExternalLink size={13} />
                                <span>{isCurrentTenant ? 'Current' : 'Select'}</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditCollege(college)}
                                className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                                title="Edit College Details"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteCollege(college)}
                                className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                                title="Decommission Institution"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: System Microservice Architecture */}
      {activeTab === 'MODULES' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Platform Microservice Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Core and pluggable microservice domains available for institutional tenants
              </p>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setNewModuleForm({ moduleCode: '', moduleName: '', moduleDescription: '' });
                setIsNewModuleModalOpen(true);
              }}
              className="text-xs"
            >
              Register System Module
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systemModules.map((mod) => (
              <div
                key={mod.moduleCode}
                className="bg-white border border-slate-200 rounded p-4 shadow-sm hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {mod.moduleCode}
                    </span>
                    {mod.isMandatory ? (
                      <Badge variant="primary">Mandatory</Badge>
                    ) : (
                      <Badge variant="neutral">Pluggable</Badge>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{mod.moduleName}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {mod.moduleDescription}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Domain: {mod.category || 'General ERP'}</span>
                  <span className="font-mono">Port: 808{mod.moduleCode === 'CORE' ? '2' : mod.moduleCode === 'CLASS' ? '3' : mod.moduleCode === 'ADMISSION' ? '4' : '5'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Register / Edit College */}
      <Modal
        isOpen={isCollegeModalOpen}
        onClose={() => setIsCollegeModalOpen(false)}
        maxWidth="max-w-2xl"
        title={isEditingCollege ? `Edit Institution: ${collegeForm.collegeName}` : 'Register Autonomous College'}
        subtitle="Establish tenant parameters, university affiliation, and campus headquarters."
      >
        <form onSubmit={handleCollegeSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="colNameInput"
              label="College Name"
              type="text"
              placeholder="e.g. Delhi Institute of Engineering & Technology"
              value={collegeForm.collegeName}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeName: e.target.value })}
              required
            />
            <Input
              id="colCodeInput"
              label="College Code (Unique)"
              type="text"
              placeholder="e.g. DIET-DELHI"
              value={collegeForm.collegeCode}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeCode: e.target.value.toUpperCase() })}
              disabled={isEditingCollege}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="univNameInput"
              label="Affiliated University Name"
              type="text"
              placeholder="e.g. Guru Gobind Singh Indraprastha University"
              value={collegeForm.universityName}
              onChange={(e) => setCollegeForm({ ...collegeForm, universityName: e.target.value })}
              required
            />
            <Input
              id="univCodeInput"
              label="University Affiliation Code"
              type="text"
              placeholder="e.g. GGSIPU"
              value={collegeForm.universityCode}
              onChange={(e) => setCollegeForm({ ...collegeForm, universityCode: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              id="colEmailInput"
              label="Official Institutional Email"
              type="email"
              placeholder="registrar@college.edu.in"
              icon={Mail}
              value={collegeForm.collegeEmail}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeEmail: e.target.value })}
              required
            />
            <Input
              id="colPhoneInput"
              label="Registrar Office Phone"
              type="text"
              placeholder="+91-11-27894500"
              icon={Phone}
              value={collegeForm.collegePhone}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegePhone: e.target.value })}
              required
            />
          </div>

          {!isEditingCollege && (
            <Input
              id="adminEmailInput"
              label="Principal / Lead Admin Email"
              type="email"
              placeholder="principal@college.edu.in"
              icon={Mail}
              value={collegeForm.adminEmail}
              onChange={(e) => setCollegeForm({ ...collegeForm, adminEmail: e.target.value })}
              required
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="colCityInput"
              label="City"
              type="text"
              placeholder="e.g. New Delhi"
              value={collegeForm.collegeCity}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeCity: e.target.value })}
            />
            <Input
              id="colStateInput"
              label="State / Province"
              type="text"
              placeholder="e.g. Delhi"
              value={collegeForm.collegeState}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeState: e.target.value })}
            />
            <Input
              id="colZipInput"
              label="Postal / ZIP Code"
              type="text"
              placeholder="e.g. 110085"
              value={collegeForm.collegeZip}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeZip: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="colDescInput" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Campus Overview & NAAC / Autonomous Standing
            </label>
            <textarea
              id="colDescInput"
              rows={3}
              placeholder="Establishment year, accreditation grade, campus infrastructure..."
              value={collegeForm.collegeDescription}
              onChange={(e) => setCollegeForm({ ...collegeForm, collegeDescription: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsCollegeModalOpen(false)}
              disabled={collegeModalLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={collegeModalLoading}
              className="text-xs"
            >
              {isEditingCollege ? 'Save Updates' : 'Register Institution'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Microservice Module Provisioning Modal */}
      <Modal
        isOpen={isModuleModalOpen}
        onClose={() => setIsModuleModalOpen(false)}
        maxWidth="max-w-xl"
        title={`ERP Modules: ${selectedCollegeForModules?.collegeName || ''}`}
        subtitle={`Select and toggle microservice modules enabled for this institutional tenant (${assignedModuleCodes.length} active).`}
      >
        <div className="space-y-4">
          {moduleModalLoading ? (
            <Loader message="Loading assigned modules..." />
          ) : (
            <>
              <div className="space-y-2.5">
                {systemModules.map((mod) => {
                  const isChecked = assignedModuleCodes.includes(mod.moduleCode);
                  const isCore = mod.moduleCode === 'CORE';

                  return (
                    <div
                      key={mod.moduleCode}
                      onClick={() => !isCore && handleToggleModuleCode(mod.moduleCode)}
                      className={`p-3 rounded border text-xs flex items-start justify-between gap-3 transition select-none ${
                        isCore
                          ? 'bg-slate-100 border-slate-300 cursor-not-allowed opacity-90'
                          : isChecked
                          ? 'bg-blue-50/70 border-blue-300 cursor-pointer'
                          : 'bg-white border-slate-200 hover:bg-slate-50 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isCore}
                          onChange={() => handleToggleModuleCode(mod.moduleCode)}
                          className="mt-0.5 rounded text-blue-800 focus:ring-blue-800"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{mod.moduleName}</span>
                            <span className="font-mono text-[10px] text-blue-900 bg-slate-100 px-1.5 py-0.2 rounded border">
                              {mod.moduleCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{mod.moduleDescription}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        {isCore ? (
                          <Badge variant="primary">Required</Badge>
                        ) : isChecked ? (
                          <Badge variant="success">Enabled</Badge>
                        ) : (
                          <Badge variant="neutral">Disabled</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p>
                  Disabling a module immediately hides associated navigation items and restricts API Gateway routing for students and faculty of this college.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Active: <strong>{assignedModuleCodes.length}</strong> of {systemModules.length} microservices
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsModuleModalOpen(false)}
                    disabled={moduleModalLoading}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveCollegeModules}
                    isLoading={moduleModalLoading}
                    className="text-xs"
                  >
                    Commit Configuration
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* MODAL 3: Register System Module */}
      <Modal
        isOpen={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
        title="Register Global System Module"
        subtitle="Define a new microservice capability for the Multi-College platform."
      >
        <form onSubmit={handleCreateNewModuleSubmit} className="space-y-4">
          <Input
            id="newModCode"
            label="Module Code (Uppercase)"
            type="text"
            placeholder="e.g. HOSTEL or TRANSPORT"
            value={newModuleForm.moduleCode}
            onChange={(e) => setNewModuleForm({ ...newModuleForm, moduleCode: e.target.value.toUpperCase() })}
            required
          />

          <Input
            id="newModName"
            label="Module Display Name"
            type="text"
            placeholder="e.g. Hostel & Residence Life"
            value={newModuleForm.moduleName}
            onChange={(e) => setNewModuleForm({ ...newModuleForm, moduleName: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="newModDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Module Capability & Description
            </label>
            <textarea
              id="newModDesc"
              rows={3}
              placeholder="Outline operational capabilities provided by this microservice..."
              value={newModuleForm.moduleDescription}
              onChange={(e) => setNewModuleForm({ ...newModuleForm, moduleDescription: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsNewModuleModalOpen(false)}
              disabled={newModuleLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={newModuleLoading}
              className="text-xs"
            >
              Register Module
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollegeManagementPage;
