import { MehOutlined } from '@ant-design/icons';
import { evaluateString } from 'formDesignerUtils';
import { IToolboxComponent } from 'interfaces';
import { useForm, useFormData, useGlobalState } from 'providers';
import React, { lazy, useEffect, useState } from 'react';
import { IMapProps } from './interfaces';
import MapSettings from './settings';
import Show from 'components/show';

const MapControl = lazy(() => import('./control'));

const Map: IToolboxComponent<IMapProps> = {
  type: 'map',
  name: 'map',
  icon: <MehOutlined />,
  factory: (model: IMapProps) => {
    const [hasWindow, setHasWindow] = useState(false);

    useEffect(() => {
      setHasWindow(true);
    }, []);

    const { defaultLat, defaultLng, latitude, longitude, ...mapProps } = model;

    const { isComponentHidden } = useForm();

    const { data: formData } = useFormData();

    const { globalState } = useGlobalState();

    const evalDefaultLat = evaluateString(defaultLat, { data: formData, globalState });
    const evalDefaultLng = evaluateString(defaultLng, { data: formData, globalState });
    const evalLat = evaluateString(latitude, { data: formData, globalState });
    const evalLng = evaluateString(longitude, { data: formData, globalState });

    if (isComponentHidden(mapProps)) return null;

    return (
      <React.Suspense fallback={<div>Loading editor...</div>}>
        <Show when={hasWindow}>
          <MapControl
            {...mapProps}
            defaultLat={evalDefaultLat}
            defaultLng={evalDefaultLng}
            longitude={evalLng}
            latitude={evalLat}
          />
        </Show>
      </React.Suspense>
    );
  },
  settingsFormFactory: ({ readOnly, model, onSave, onCancel, onValuesChange }) => {
    return (
      <MapSettings
        readOnly={readOnly}
        model={model}
        onSave={onSave}
        onCancel={onCancel}
        onValuesChange={onValuesChange}
      />
    );
  },
};

export default Map;
