import type { IBaseRbacItemResponse } from '@owl/contracts';

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TypesItem } from "@owl/rbac-manager";
import { IsOptional } from "class-validator";

export abstract class BaseRbacItemResponse implements IBaseRbacItemResponse {

  @ApiPropertyOptional({ type: () => String })
  readonly name: string;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  readonly description: string | null = '';

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  readonly ruleName: string | null = null;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  readonly createdAt: string | null = null;

  @ApiPropertyOptional({ type: () => String })
  @IsOptional()
  readonly updatedAt: string | null = null;

  constructor(
    name: string,
    description: string | null = null,
    ruleName: string | null = null,
    createdAt: string | null = null,
    updatedAt: string | null = null,
  ) {
    this.name = name;
    this.description = description;
    this.ruleName = ruleName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
