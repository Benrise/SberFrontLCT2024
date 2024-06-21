import { DataframeNamesEnum } from "@/entities/table/model";

export type TableRowData = Record<string, string>;

export type DataTableProps = {
    dfName: DataframeNamesEnum;
    editable?: boolean;
  };
  
 export type PaginationMeta = {
    n?: number;
    pg?: number;
    rows?: number;
    pages?: number;
  };