import { IUpdatePermissionRequest } from "@owl/contracts";

import { BaseRbacItemRequest } from "../base/base-item.request.dto";

export class UpdatePermissionRequest extends BaseRbacItemRequest implements IUpdatePermissionRequest {}
