import { DesignerToolbarSettings } from '../../../../interfaces/toolbarSettings';

export const AnnotationSettingsForm = new DesignerToolbarSettings()
    .addSectionSeparator({
        id: "b8954bf6-f76d-4139-a850-c99bf06c8b69",
        name: "separator1",
        parentId: "root",
        label: "Display"
    })
    .addPropertyAutocomplete({
        id: "5c813b1a-04c5-4658-ac0f-cbcbae6b3bd4",
        name: "name",
        parentId: "root",
        label: "Name",
        validate: {
            required: true
        }
    })
    .addTextField({
        id: "46d07439-4c18-468c-89e1-60c002ce96c5",
        name: "label",
        parentId: "root",
        label: "Label"
    })
    .addDropdown({
        id: "57a40a33-7e08-4ce4-9f08-a34d24a83338",
        name: "labelAlign",
        parentId: "root",
        label: "Label align",
        values: [
            {
                label: "left",
                value: "left",
                id: "f01e54aa-a1a4-4bd6-ba73-c395e48af8ce"
            },
            {
                label: "right",
                value: "right",
                id: "b920ef96-ae27-4a01-bfad-b5b7d07218da"
            }
        ],
        dataSourceType: "values"
    })
    .addTextArea({
        id: "2d32fe70-99a0-4825-ae6c-8b933004e119",
        name: "description",
        parentId: "root",
        label: "Description"
    })
    .addDropdown({
        id: "df8a8f35-a50b-42f9-9642-73d390ceddbf",
        name: "visibility",
        parentId: "root",
        label: "Visibility",
        description: "This property will eventually replace the 'hidden' property and other properties that toggle visibility on the UI and payload",
        allowClear: true,
        values: [
            {
                label: "Yes (Display in UI and include in payload)",
                value: "Yes",
                id: "53cd10ce-26af-474b-af75-8e7b1f19e51d"
            },
            {
                label: "No (Only include in payload)",
                value: "No",
                id: "f07a228c-cb9c-4da7-a8bc-bc2be518a058"
            },
            {
                label: "Removed (Remove from UI and exlude from payload)",
                value: "Removed",
                id: "3b6282ee-2eee-47ec-bab9-4cba52b970a0"
            }
        ],
        dataSourceType: "values"
    })
    .addCheckbox({
        id: "cfd7d45e-c7e3-4a27-987b-dc525c412448",
        name: "hidden",
        parentId: "root",
        label: "Hidden"
    })
    .addCheckbox({
        id: "c6885251-96a6-40ce-99b2-4b5209a9e01c",
        name: "hideLabel",
        parentId: "root",
        label: "Hide Label"
    })
    .addCheckbox({
        id: "24a8be15-98eb-40f7-99ea-ebb602693e9c",
        name: "disabled",
        parentId: "root",
        label: "Disabled"
    })
    .addCodeEditor({
        id: "4b5e5951-4998-4635-b1c8-0b6d3940c300",
        name: "customEnabled",
        label: "Custom Enabled",
        labelAlign: "right",
        parentId: "root",
        hidden: false,
        customEnabled: null,
        description: "Enter custom enabled code.  You must return true to enable the component. The global variable data is provided, and allows you to access the data of any form component, by using its API key.",
        validate: {},
        settingsValidationErrors: [],
        exposedVariables: [
            { id: "3be9da3f-f47e-48ae-b4c3-f5cc36e534d7", name: "value", description: "Component current value", type: "string | any" },
            { id: "3be9da3f-f58e-48ae-b4c3-f5cc36e534d7", name: "data", description: "Selected form values", type: "object" }
        ]
    })
    .addSectionSeparator({
        id: "5478b8f9-ec00-4d0a-9k2a-44a630cb2dcb",
        name: "filesSeparator",
        parentId: "root",
        label: "Customize Annotation"
    })
    .addCheckbox({
        id: "3be9da3f-f47e-48ae-b4c3-f5cc36f934d9",
        name: "isOnImage",
        parentId: "root",
        label: "Annotation on Image"
    })
    .addSectionSeparator({
        id: "d675bfe4-ee69-431e-931b-b0e0b9ceee6f",
        name: "separator2",
        parentId: "root",
        label: "Validation"
    })
    .addCheckbox({
        id: "3be9da3f-f47e-48ae-b4c3-f5cc36e534d9",
        name: "validate.required",
        parentId: "root",
        label: "Required"
    })
    .addSectionSeparator({
        id: "6befdd49-41aa-41d6-a29e-76fa00590b75",
        name: "sectionStyle",
        parentId: "root",
        label: "Style"
    })
    .addCodeEditor({
        id: "06ab0599-914d-4d2d-875c-765a495472f8",
        name: "style",
        label: "Style",
        parentId: "root",
        validate: {},
        settingsValidationErrors: [],
        description: "A script that returns the style of the element as an object. This should conform to CSSProperties",
        exposedVariables: [{ id: "3tg9da3f-f58e-48ae-b4c3-f5cc36e534d7", name: "data", description: "Form values", type: "object" }]
    })

    .addSectionSeparator({
        id: "5478b8f9-ec00-4d0a-9d2a-44a630cb2dcb",
        name: "filesSeparator",
        parentId: "root",
        label: "Files"
    })
    .addNumberField({
        id: "417ee22e-a49d-44f2-a1c7-fef42ec87503",
        name: "height",
        parentId: "root",
        label: "Height"
    })
    .addNumberField({
        id: "c6ecd70c-7419-4ea7-a715-d42699d26e6e",
        name: "width",
        parentId: "root",
        label: "Width"
    })
    .addCodeEditor({
        id: "06ab0599-914d-4d2d-875c-765a495482f8",
        name: "url",
        label: "Url",
        parentId: "root",
        validate: {},
        settingsValidationErrors: [],
        description: "A script that returns the image url as a string. This should return a string",
        exposedVariables: [{ id: "fb85d916-39f9-4f88-8d87-c1c53558b078", name: "data", description: "Form values", type: "object" }]
    })
    .toJson()