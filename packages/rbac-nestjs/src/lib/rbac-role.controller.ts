import {
  Controller,
  HttpStatus,
  Post,
  Body,
  Inject,
  Injectable,
  Put,
  HttpCode,
  Delete,
  Param
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Manager, Role } from '@owl/rbac-manager';
import { RoleResponse } from './dto/role/role.response.dto';
import { CreateRoleRequest } from './dto/role/create-role.request.dto';
import { RbacItemMapper } from './mapper/rbac-item.mapper';
import { UpdateRoleRequest } from './dto/role/update-role.request.dto';
import { rbacItemMapperFactory } from './factory/rbac-item-mapper.factory';

@ApiTags('Rbac Role')
@Controller('rbac/roles')
@ApiBearerAuth()
@Injectable()
export class RbacRoleController {

  private mapper: RbacItemMapper<Role, CreateRoleRequest | UpdateRoleRequest, RoleResponse>

  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {
    this.mapper = rbacItemMapperFactory(Role, RoleResponse)
  }

	@ApiOperation({ summary: 'Create new role' })
    @ApiCreatedResponse({
      description: 'The role has been successfully created.',
      type: RoleResponse
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async createRole(@Body() createRoleDto: CreateRoleRequest) {
    const addedRole = await this.rbacManager.addRole(
      this.mapper.toPersistence(createRoleDto)
    );

    return this.mapper.toResponse(addedRole);
  }

	@ApiOperation({ summary: 'Update role' })
    @ApiAcceptedResponse({
      description: 'Role has been successfully updated.',
      type: RoleResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Role not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
	@Put(':name')
  async updateRole(@Param('name') name: string, @Body() updateRoleDto: UpdateRoleRequest) {
    const updatedRole = await this.rbacManager.updateRole(
      name, this.mapper.toPersistence(updateRoleDto)
    );

    return this.mapper.toResponse(updatedRole);
  }

  @ApiOperation({ summary: 'Delete role' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Role has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Record not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':name')
  async remove(@Param('name') name: string): Promise<void> {
    await this.rbacManager.removeRole(name);
  }

	@ApiOperation({ summary: 'Assign to role permissions or other roles' })
    @ApiAcceptedResponse({
      description: 'Assign has been successfully invoked.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Put('/assign/:name')
  async assign(@Param('name') name: string, @Body() items: Array<string>): Promise<void> {
    items.map(async (item: string): Promise<void> => {
      this.rbacManager.addChild(name, item);
    });
  }

	@ApiOperation({ summary: 'Revoke role or permissions from role' })
    @ApiAcceptedResponse({
      description: 'Revoke has been successfully invoked.',
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Put('/revoke/:name')
  async revoke(@Param('name') name: string, @Body() items: Array<string>) {
    items.map(async (item: string): Promise<void> => {
      this.rbacManager.removeChild(name, item);
    });
  }
}
