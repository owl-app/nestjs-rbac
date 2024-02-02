import { IPermissionResponse } from "@owl/contracts";

import { BaseRbacItemResponse } from "../base/base-item.response.dto"

export class PermissionResponse extends BaseRbacItemResponse implements IPermissionResponse {}