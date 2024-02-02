import { Type } from '@nestjs/common';
import { Item } from '@owl/rbac-manager';

import { RbacItemMapper } from '../mapper/rbac-item.mapper';
import { BaseRbacItemResponse } from '../dto/base/base-item.response.dto';

export const rbacItemMapperFactory = <
  Entity extends Item,
  Response extends BaseRbacItemResponse
>(
  entity: Type<Entity>,
  response: Type<Response>
) => {
  return new RbacItemMapper(entity, response);
};
