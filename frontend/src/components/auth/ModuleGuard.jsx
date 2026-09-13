import React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { useAuth } from '../../hooks/useAuth';
import { ModuleNotEnabledPage } from '../../pages/common/ModuleNotEnabledPage';
import { Loader } from '../common/Loader';

export const ModuleGuard = ({
  moduleCode,
  moduleTitle,
  children,
}) => {
  const { hasModule, isModulesLoading } = useTenant();
  const { isMainAdmin } = useAuth();

  if (isModulesLoading) {
    return <Loader message="Verifying module subscription..." />;
  }

  // Super Admins always have unrestricted platform access
  if (isMainAdmin) {
    return children;
  }

  if (!hasModule(moduleCode)) {
    return (
      <ModuleNotEnabledPage
        moduleCode={moduleCode}
        moduleTitle={moduleTitle || moduleCode}
      />
    );
  }

  return children;
};

export default ModuleGuard;
