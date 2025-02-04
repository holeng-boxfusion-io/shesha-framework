export interface IReferenceList {
    name: string;
    items: IReferenceListItem[];
    /**
     * Cache MD5, is used for client-side caching
     */
    cacheMd5?: string | null;
}

export interface IReferenceListItem {
    id?: string;
    item?: string | null;
    itemValue?: number;
    description?: string | null;
    orderIndex?: number;

    /**
     * Color associated with the item
     */
    color?: string | null;
    /**
     * Icon associated with the item
     */
    icon?: string | null;
    /**
     * Short alias
     */
    shortAlias?: string | null;
}