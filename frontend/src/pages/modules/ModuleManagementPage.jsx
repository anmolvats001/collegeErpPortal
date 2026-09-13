import React, { useState, useEffect, useCallback } from 'react';
import { moduleService } from '../../services/moduleService';
import { collegeService } from '../../services/collegeService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import { AlertBanner } from '../../components/common/AlertBanner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Layers,
  Plus,
  RefreshCw,
  Building2,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Server,
  Sliders,
  Filter,
  Check,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_SYSTEM_MODULES,
  MOCK_COLLEGES,
  MOCK_COLLEGE_MODULES,
} from '../../utils/mockData';

export const ModuleManagementPage = () => {
  const [systemModules, setSystemModules] = useState(
    IS_PREVIEW_MODE ? MOCK_SYSTEM_MODULES : []
  );
  const [colleges, setColleges] = useState(
    IS_PREVIEW_MODE ? MOCK_COLLEGES : []
  );
  const [collegeModulesMap, setCollegeModulesMap] = useState(
    IS_PREVIEW_MODE ? MOCK_COLLEGE_MODULES : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('MATRIX'); // 'MATRIX' | 'CATALOG' | 'FILTER'
  const [selectedFilterModule, setSelectedFilterModule] = useState('FEE');
  const [alert, setAlert] = useState(null);

  // Register New Platform Module Modal
  const [isNewModuleModalOpen, setIsNewModuleModalOpen] = useState(false);
  const [newModuleLoading, setNewModuleLoading] = useState(false);
  const [newModuleForm, setNewModuleForm] = useState({
    moduleCode: '',
    moduleName: '',
    moduleDescription: '',
  });

  // Confirm Modal state for toggling/unassigning modules
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    collegeId: null,
    collegeName: '',
    moduleCode: '',
    action: 'toggle', // 'toggle' | 'remove'
    nextStatus: false,
  });

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [modulesData, collegesData] = await Promise.allSettled([
        moduleService.getAllSystemModules(),
        collegeService.getAllColleges(0, 50),
      ]);

      if (modulesData.status === 'fulfilled' && Array.isArray(modulesData.value) && modulesData.value.length > 0) {
        setSystemModules(modulesData.value);
      } else if (IS_PREVIEW_MODE) {
        setSystemModules(MOCK_SYSTEM_MODULES);
      }

      if (
        collegesData.status === 'fulfilled' &&
        collegesData.value?.colleges?.content &&
        collegesData.value.colleges.content.length > 0
      ) {
        setColleges(collegesData.value.colleges.content);
      } else if (IS_PREVIEW_MODE) {
        setColleges(MOCK_COLLEGES);
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setSystemModules(MOCK_SYSTEM_MODULES);
        setColleges(MOCK_COLLEGES);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load module architecture data.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Create System Module
  const handleCreateModuleSubmit = async (e) => {
    e.preventDefault();
    if (!newModuleForm.moduleCode.trim() || !newModuleForm.moduleName.trim()) return;

    setNewModuleLoading(true);
    try {
      await moduleService.createSystemModule(newModuleForm);
      setAlert({
        type: 'success',
        message: `Platform microservice module "${newModuleForm.moduleName}" registered.`,
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

  // Trigger Confirmation for module toggle
  const requestToggleModule = (college, moduleCode) => {
    if (moduleCode === 'CORE') return; // Cannot toggle Core

    const currentModules = collegeModulesMap[college.collegeId] || ['CORE'];
    const isCurrentlyEnabled = currentModules.includes(moduleCode);

    setConfirmState({
      isOpen: true,
      collegeId: college.collegeId,
      collegeName: college.collegeName,
      moduleCode,
      action: 'toggle',
      nextStatus: !isCurrentlyEnabled,
    });
  };

  // Confirm and commit module toggle
  const handleConfirmToggle = async () => {
    const { collegeId, moduleCode, nextStatus, collegeName } = confirmState;
    setConfirmState({ ...confirmState, isOpen: false });

    try {
      if (nextStatus) {
        await moduleService.assignModuleToCollege(collegeId, moduleCode);
      } else {
        await moduleService.removeModuleFromCollege(collegeId, moduleCode);
      }

      setCollegeModulesMap((prev) => {
        const list = prev[collegeId] || [];
        const updated = nextStatus
          ? [...new Set([...list, moduleCode])]
          : list.filter((code) => code !== moduleCode);
        return { ...prev, [collegeId]: updated };
      });

      setAlert({
        type: 'success',
        message: `Module "${moduleCode}" ${nextStatus ? 'enabled' : 'disabled'} for ${collegeName}.`,
      });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setCollegeModulesMap((prev) => {
          const list = prev[collegeId] || [];
          const updated = nextStatus
            ? [...new Set([...list, moduleCode])]
            : list.filter((code) => code !== moduleCode);
          return { ...prev, [collegeId]: updated };
        });

        setAlert({
          type: 'success',
          message: `[Preview Mode] Module "${moduleCode}" ${nextStatus ? 'enabled' : 'disabled'} for ${collegeName}.`,
        });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to update module status.',
        });
      }
    }
  };

  // Colleges filtered by currently selected module in Tab 3
  const collegesWithSelectedModule = colleges.filter((c) => {
    const assigned = collegeModulesMap[c.collegeId] || [];
    return assigned.includes(selectedFilterModule);
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">
              Microservice Module Architecture & Tenant Subscriptions
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Global microservice registry, autonomous college subscriptions, and domain gating rules
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
            onClick={() => {
              setNewModuleForm({ moduleCode: '', moduleName: '', moduleDescription: '' });
              setIsNewModuleModalOpen(true);
            }}
            className="text-xs"
          >
            Register Module
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <AlertBanner
          type={alert.type}
          message={alert.message}
          onDismiss={() => setAlert(null)}
        />
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Server size={16} className="text-blue-800" />
            <span>Platform Modules</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{systemModules.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Microservices deployed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>Core Foundation</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">1</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Mandatory for all tenants</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Sliders size={16} className="text-purple-700" />
            <span>Pluggable Services</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{systemModules.length - 1}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Subscribed per campus</p>
        </div>

        <div className="bg-white border border-slate-200 rounded p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <Building2 size={16} className="text-amber-700" />
            <span>Affiliated Campuses</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{colleges.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Autonomous colleges</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'MATRIX'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders size={16} />
          <span>Tenant Subscription Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'CATALOG'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server size={16} />
          <span>Platform Modules Catalog ({systemModules.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('FILTER')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'FILTER'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Filter size={16} />
          <span>Distribution by Module</span>
        </button>
      </div>

      {/* TAB 1: Subscription Matrix */}
      {activeTab === 'MATRIX' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>
              Click on any module toggle chip to immediately activate or suspend that microservice capability for the institution.
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              CORE module is required for all tenants
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 min-w-[220px]">Institution / Campus</th>
                  {systemModules.map((mod) => (
                    <th key={mod.moduleCode} className="py-3 px-2 text-center">
                      <span className="font-mono text-[10px] block">{mod.moduleCode}</span>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center">Total Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {colleges.map((college) => {
                  const assigned =
                    collegeModulesMap[college.collegeId] ||
                    ['CORE', 'CLASS', 'ATTENDANCE', 'NOTIFICATION'];

                  return (
                    <tr key={college.collegeId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div>{college.collegeName}</div>
                        <span className="font-mono text-[10px] text-slate-500">
                          {college.collegeCode}
                        </span>
                      </td>

                      {systemModules.map((mod) => {
                        const isEnabled = assigned.includes(mod.moduleCode);
                        const isCore = mod.moduleCode === 'CORE';

                        return (
                          <td key={mod.moduleCode} className="py-3 px-2 text-center">
                            {isCore ? (
                              <span
                                className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700 border border-slate-300 select-none"
                                title="CORE is mandatory for all tenants"
                              >
                                <Check size={10} /> REQ
                              </span>
                            ) : (
                              <button
                                onClick={() => requestToggleModule(college, mod.moduleCode)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition inline-flex items-center gap-1 ${
                                  isEnabled
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700'
                                }`}
                                title={`Click to ${isEnabled ? 'suspend' : 'enable'} ${mod.moduleName}`}
                              >
                                {isEnabled ? (
                                  <>
                                    <CheckCircle size={10} className="text-emerald-600" />
                                    <span>ON</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={10} className="text-slate-400" />
                                    <span>OFF</span>
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-3 px-4 text-center">
                        <Badge variant="primary">{assigned.length} Active</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: System Modules Catalog */}
      {activeTab === 'CATALOG' && (
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
                    <Badge variant="primary">System Essential</Badge>
                  ) : (
                    <Badge variant="neutral">Pluggable Domain</Badge>
                  )}
                </div>
                <h3 className="text-xs font-bold text-slate-900">{mod.moduleName}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {mod.moduleDescription}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Category: {mod.category || 'General'}</span>
                <span>
                  Port: 808{mod.moduleCode === 'CORE' ? '2' : mod.moduleCode === 'CLASS' ? '3' : mod.moduleCode === 'ADMISSION' ? '4' : '5'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Filter Colleges by Module */}
      {activeTab === 'FILTER' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Microservice Domain
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect which institutions currently hold active subscriptions to this service
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {systemModules.map((m) => (
                <button
                  key={m.moduleCode}
                  onClick={() => setSelectedFilterModule(m.moduleCode)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition border ${
                    selectedFilterModule === m.moduleCode
                      ? 'bg-blue-800 text-white border-blue-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {m.moduleCode}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>
                Institutions Subscribing to <strong>{selectedFilterModule}</strong> (
                {collegesWithSelectedModule.length} Colleges)
              </span>
            </div>

            {collegesWithSelectedModule.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <Layers size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No colleges currently subscribed to {selectedFilterModule}</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">College Name</th>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Affiliated University</th>
                    <th className="py-3 px-4">Campus Location</th>
                    <th className="py-3 px-4 text-right">Module Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {collegesWithSelectedModule.map((c) => (
                    <tr key={c.collegeId} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{c.collegeName}</td>
                      <td className="py-3 px-4 font-mono">{c.collegeCode}</td>
                      <td className="py-3 px-4 text-slate-600">{c.universityName}</td>
                      <td className="py-3 px-4 text-slate-600">{c.collegeCity}, {c.collegeState}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="success">Active Subscription</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Register System Module */}
      <Modal
        isOpen={isNewModuleModalOpen}
        onClose={() => setIsNewModuleModalOpen(false)}
        title="Register Global System Module"
        subtitle="Establish a new microservice domain available across institutional tenants."
      >
        <form onSubmit={handleCreateModuleSubmit} className="space-y-4">
          <Input
            id="modCodeInput"
            label="Module Code (Uppercase)"
            type="text"
            placeholder="e.g. HOSTEL or TRANSPORT"
            value={newModuleForm.moduleCode}
            onChange={(e) =>
              setNewModuleForm({ ...newModuleForm, moduleCode: e.target.value.toUpperCase() })
            }
            required
          />

          <Input
            id="modNameInput"
            label="Display Title"
            type="text"
            placeholder="e.g. Hostel & Residence Management"
            value={newModuleForm.moduleName}
            onChange={(e) => setNewModuleForm({ ...newModuleForm, moduleName: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="modDescInput" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Module Functional Scope
            </label>
            <textarea
              id="modDescInput"
              rows={3}
              placeholder="Outline operational capabilities provided by this microservice..."
              value={newModuleForm.moduleDescription}
              onChange={(e) =>
                setNewModuleForm({ ...newModuleForm, moduleDescription: e.target.value })
              }
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
              Commit Module
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM MODAL: Toggle Module Status */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={handleConfirmToggle}
        title={confirmState.nextStatus ? 'Enable Microservice Module' : 'Suspend Microservice Module'}
        message={`Are you sure you want to ${
          confirmState.nextStatus ? 'grant access to' : 'suspend'
        } module "${confirmState.moduleCode}" for "${confirmState.collegeName}"?`}
        warning={
          !confirmState.nextStatus
            ? 'Suspending this module will immediately block portal navigation and API Gateway routes for students and staff of this college.'
            : ''
        }
        confirmText={confirmState.nextStatus ? 'Enable Module' : 'Suspend Module'}
        isDestructive={!confirmState.nextStatus}
      />
    </div>
  );
};

export default ModuleManagementPage;
