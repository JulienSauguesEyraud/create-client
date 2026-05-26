import type { {{{ucf}}} } from "../../interfaces/{{{ucf}}}";

type TResource = {{{ucf}}};

export interface FieldDefinition {
  name: string;
  description: string;
  type: string;
  readonly?: boolean;
  required?: boolean;
  step?: string;
  isRelations?: boolean;
  isReferences?: boolean;
  isEmbeddeds?: boolean;
}

export default TResource;
