import React, { FC, useContext, PropsWithChildren, useEffect, MutableRefObject } from 'react';
import formReducer from './reducer';
import {
  FormActionsContext,
  FormStateContext,
  FORM_CONTEXT_INITIAL_STATE,
  ISetFormDataPayload,
  IFormStateContext,
  ConfigurableFormInstance,
  IFormActionsContext,
} from './contexts';
import {
  IFormActions,
  IFormSections,
  FormMode,
  IFlatComponentsStructure,
  IFormSettings,
  FormRawMarkup,
} from './models';
import { getFlagSetters } from '../utils/flagsSetters';
import {
  setFlatComponentsAction,
  setSettingsAction,
  setFormModeAction,
  setFormDataAction,
  registerComponentActionsAction,
  setValidationErrorsAction,
} from './actions';
import { convertActions, convertSectionsToList, useFormDesignerComponents } from './utils';
import { FormInstance } from 'antd';
import useThunkReducer from '../../hooks/thunkReducer';
import { IFormValidationErrors } from '../../interfaces';
import { useConfigurableAction } from '../configurableActionsDispatcher';
import { SheshaActionOwners } from '../configurableActionsDispatcher/models';

export interface IFormProviderProps {
  name: string;
  flatComponents: IFlatComponentsStructure;
  formSettings: IFormSettings;
  formMarkup?: FormRawMarkup;
  mode: FormMode;
  form?: FormInstance<any>;
  actions?: IFormActions;
  sections?: IFormSections;
  context?: any; // todo: make generic
  formRef?: MutableRefObject<Partial<ConfigurableFormInstance> | null>;
  onValuesChange?: (changedValues: any, values: any /*Values*/) => void;
  /**
   * External data fetcher, is used to refresh form data from the back-end.
   */
  refetchData?: () => Promise<any>;
  /**
   * If true, form should register configurable actions. Should be enabled for main forms only
   */
  isActionsOwner: boolean;
}

const FormProvider: FC<PropsWithChildren<IFormProviderProps>> = ({
  name,
  children,
  flatComponents,
  mode = 'readonly',
  form,
  actions,
  sections,
  context,
  formRef,
  formSettings,
  formMarkup,
  refetchData,
  isActionsOwner,
}) => {
  const toolboxComponents = useFormDesignerComponents();

  const getToolboxComponent = (type: string) => toolboxComponents[type];

  //#region data fetcher

  const fetchData = (): Promise<any> => {
    return refetchData ? refetchData() : Promise.reject('fetcher not specified');
  };

  //#endregion

  //#region configurable actions

  const actionsOwnerUid = isActionsOwner ? SheshaActionOwners.Form : null;
  const actionDependencies = [actionsOwnerUid];

  //console.log('isActionsOwner', isActionsOwner);

  useConfigurableAction(
    {
      name: 'Start Edit',
      owner: name,
      ownerUid: actionsOwnerUid,
      hasArguments: false,
      executer: () => {
        setFormMode('edit');
        return Promise.resolve();
      },
    },
    actionDependencies
  );

  useConfigurableAction(
    {
      name: 'Cancel Edit',
      owner: name,
      ownerUid: actionsOwnerUid,
      hasArguments: false,
      executer: () => {
        setFormMode('readonly');
        return Promise.resolve();
      },
    },
    actionDependencies
  );

  useConfigurableAction(
    {
      name: 'Submit',
      owner: name,
      ownerUid: actionsOwnerUid,
      hasArguments: false,
      executer: () => {
        form.submit();
        return Promise.resolve();
      },
    },
    actionDependencies
  );

  useConfigurableAction(
    {
      name: 'Reset',
      owner: name,
      ownerUid: actionsOwnerUid,
      hasArguments: false,
      executer: () => {
        form.resetFields();
        return Promise.resolve();
      },
    },
    actionDependencies
  );

  useConfigurableAction(
    {
      name: 'Refresh',
      description: 'Refresh the form data by fetching it from the back-end',
      owner: name,
      ownerUid: actionsOwnerUid,
      hasArguments: false,
      executer: () => {
        return fetchData();
      },
    },
    actionDependencies
  );

  //#endregion

  const initial: IFormStateContext = {
    ...FORM_CONTEXT_INITIAL_STATE,
    formMode: mode,
    form,
    actions: convertActions(null, actions),
    sections: convertSectionsToList(null, sections),
    context,
    ...flatComponents,
    formSettings: formSettings,
    formMarkup: formMarkup,
  };

  const [state, dispatch] = useThunkReducer(formReducer, initial);

  useEffect(() => {
    if (
      flatComponents &&
      (flatComponents.allComponents !== state.allComponents ||
        flatComponents.componentRelations !== state.componentRelations)
    ) {
      setFlatComponents(flatComponents);
    }
  }, [flatComponents]);

  useEffect(() => {
    if (formSettings !== state.formSettings) {
      setSettings(formSettings);
    }
  }, [formSettings]);

  useEffect(() => {
    if (mode !== state.formMode) {
      setFormMode(mode);
    }
  }, [mode]);

  const getComponentModel = componentId => {
    return state.allComponents[componentId];
  };

  const getChildComponents = (componentId: string) => {
    const childIds = state.componentRelations[componentId];
    if (!childIds) return [];
    const components = childIds.map(childId => {
      return state.allComponents[childId];
    });
    return components;
  };

  const setFormMode = (formMode: FormMode) => {
    dispatch(setFormModeAction(formMode));
  };

  const setFlatComponents = (flatComponents: IFlatComponentsStructure) => {
    dispatch(setFlatComponentsAction(flatComponents));
  };

  const setSettings = (settings: IFormSettings) => {
    dispatch(setSettingsAction(settings));
  };

  const setFormData = (payload: ISetFormDataPayload) => {
    dispatch((dispatchThunk, _getState) => {
      dispatchThunk(setFormDataAction(payload));
    });
  };

  const setFormDataAndInstance = (payload: ISetFormDataPayload) => {
    setFormData(payload);

    if (payload?.mergeValues) {
      form?.setFieldsValue(payload?.values);
    } else {
      form?.resetFields();
      form?.setFieldsValue(payload?.values);
    }
  };

  const setValidationErrors = (payload: IFormValidationErrors) => {
    dispatch(setValidationErrorsAction(payload));
  };

  //#region form actions
  const registerActions = (ownerId: string, actionsToRegister: IFormActions) => {
    dispatch(registerComponentActionsAction({ id: ownerId, actions: actionsToRegister }));
  };

  const getAction = (componentId: string, name: string) => {
    // search requested action in all parents and fallback to form
    let currentId = componentId;
    do {
      const component = state.allComponents[currentId];

      const action = state.actions.find(a => a.owner === (component?.parentId ?? null) && a.name === name);
      if (action) return (data, parameters) => action.body(data, parameters);

      currentId = component?.parentId;
    } while (currentId);

    return null;
  };
  //#endregion

  const getSection = (componentId: string, name: string) => {
    // search requested section in all parents and fallback to form
    let currentId = componentId;

    do {
      const component = state.allComponents[currentId];

      const section = state.sections.find(a => a.owner === (component?.parentId ?? null) && a.name === name);
      if (section) return data => section.body(data);

      currentId = component?.parentId;
    } while (currentId);

    return null;
  };

  const configurableFormActions: IFormActionsContext = {
    ...getFlagSetters(dispatch),
    getComponentModel,
    getChildComponents,
    setFormMode,
    setFormData,
    setValidationErrors,
    registerActions,
    getAction,
    getSection,
    getToolboxComponent,
    setFormDataAndInstance,
  };
  if (formRef) formRef.current = { ...configurableFormActions, ...state };

  return (
    <FormStateContext.Provider value={state}>
      <FormActionsContext.Provider value={configurableFormActions}>{children}</FormActionsContext.Provider>
    </FormStateContext.Provider>
  );
};

function useFormState(require: boolean = true) {
  const context = useContext(FormStateContext);

  if (require && context === undefined) {
    throw new Error('useFormState must be used within a FormProvider');
  }

  return context;
}

function useFormActions(require: boolean = true) {
  const context = useContext(FormActionsContext);

  if (require && context === undefined) {
    throw new Error('useFormActions must be used within a FormProvider');
  }

  return context;
}

function useForm(require: boolean = true) {
  const actionsContext = useFormActions(require);
  const stateContext = useFormState(require);

  // useContext() returns initial state when provider is missing
  // initial context state is useless especially when require == true
  // so we must return value only when both context are available
  return actionsContext !== undefined && stateContext !== undefined
    ? { ...actionsContext, ...stateContext }
    : undefined;
}

const isInDesignerMode = () => {
  const context = useContext(FormStateContext);
  return context ? context.formMode === 'designer' : false;
};

export { FormProvider, useFormState, useFormActions, useForm, isInDesignerMode };
