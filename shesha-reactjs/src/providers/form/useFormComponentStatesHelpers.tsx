import { useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useDebouncedCallback } from 'use-debounce';
import { useForm } from '.';
import { useFormData } from '../formContext';
import { useGlobalState } from '../globalState';
import { IFormStateContext } from './contexts';
import { IConfigurableFormComponent } from './models';
import { getEnabledComponentIds, getVisibleComponentIds } from './utils';

interface IFormStateHelpersState {
  /**
   * If true, indicates that list of visible components are calculated
   */
  visibleComponentIdsIsSet: boolean;
  visibleComponentIds?: string[];
  enabledComponentIds?: string[];
}

const initialState: IFormStateHelpersState = {
  visibleComponentIds: [],
  enabledComponentIds: [],
  visibleComponentIdsIsSet: false,
};

interface IFormStateHelpersValue extends IFormStateHelpersState {
  isComponentDisabled: (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'disabled'>) => boolean;
  isComponentHidden: (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'hidden'>) => boolean;
}

interface IFormStateHelpersContext extends Pick<IFormStateContext, 'allComponents' | 'formData' | 'formMode'> {
  globalState: any;
}

export const useFormComponentStatesHelpers = (): IFormStateHelpersValue => {
  const [{ visibleComponentIds, enabledComponentIds, visibleComponentIdsIsSet }, setState] = useState<
    IFormStateHelpersState
  >(initialState);

  const { data } = useFormData();
  const { formMode, allComponents } = useForm();
  const { globalState } = useGlobalState();

  const updateVisibleComponents = (formContext: IFormStateHelpersContext) => {
    const _visibleComponents = getVisibleComponentIds(
      formContext.allComponents,
      formContext.formData,
      // subFormValue ?? formContext.formData,
      globalState,
      formContext?.formMode
    );
    setVisibleComponents(_visibleComponents);
  };

  const debouncedUpdateVisibleComponents = useDebouncedCallback<(context: IFormStateHelpersContext) => void>(
    formContext => {
      updateVisibleComponents(formContext);
    },
    // delay in ms
    200
  );

  const updateEnabledComponents = (formContext: IFormStateHelpersContext) => {
    const _enabledComponents = getEnabledComponentIds(
      formContext.allComponents,
      formContext.formData,
      // subFormValue ?? formContext.formData,
      globalState,
      formContext?.formMode
    );

    setEnabledComponents(_enabledComponents);
  };

  const debouncedUpdateEnabledComponents = useDebouncedCallback<(context: IFormStateHelpersContext) => void>(
    formContext => {
      updateEnabledComponents(formContext);
    },
    // delay in ms
    200
  );

  const setVisibleComponents = (ids: string[]) =>
    setState(prev => ({ ...prev, visibleComponentIds: ids, visibleComponentIdsIsSet: true }));

  const setEnabledComponents = (ids: string[]) => setState(prev => ({ ...prev, enabledComponentIds: ids }));

  const isComponentDisabled = (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'disabled'>): boolean => {
    const disabledByCondition =
      model.isDynamic !== true && enabledComponentIds && !enabledComponentIds.includes(model.id);

    return formMode !== 'designer' && (model.disabled || disabledByCondition);
  };

  const isComponentHidden = (model: Pick<IConfigurableFormComponent, 'id' | 'isDynamic' | 'hidden'>): boolean => {
    const hiddenByCondition =
      model.isDynamic !== true && visibleComponentIds && !visibleComponentIds.includes(model.id);

    return formMode !== 'designer' && hiddenByCondition;
  };

  useDeepCompareEffect(() => {
    const context: IFormStateHelpersContext = {
      allComponents,
      formData: data,
      globalState,
      formMode,
    };

    debouncedUpdateVisibleComponents(context);
    debouncedUpdateEnabledComponents(context);
  }, [allComponents, formMode, data, globalState]);

  return { visibleComponentIdsIsSet, visibleComponentIds, enabledComponentIds, isComponentDisabled, isComponentHidden };
};
