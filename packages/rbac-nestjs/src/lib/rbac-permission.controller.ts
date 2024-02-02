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
  Param,
  Get
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Manager, Permission } from '@owl/rbac-manager';
import { RoleResponse } from './dto/role/role.response.dto';
import { RbacItemMapper } from './mapper/rbac-item.mapper';
import { UpdateRoleRequest } from './dto/role/update-role.request.dto';
import { CreatePermissionRequest } from './dto/permission/create-permission.request.dto';
import { PermissionResponse } from './dto/permission/permission.response.dto';
import { UpdatePermissionRequest } from './dto/permission/update-permission.request.dto';
import { rbacItemMapperFactory } from './factory/rbac-item-mapper.factory';

@ApiTags('Rbac Permission')
@Controller('rbac/permissions')
@ApiBearerAuth()
@Injectable()
export class RbacPermissionController {

  private mapper: RbacItemMapper<Permission, CreatePermissionRequest | UpdatePermissionRequest, PermissionResponse>

  constructor(@Inject('RBAC_MANAGER') readonly rbacManager: Manager) {
    this.mapper = rbacItemMapperFactory(Permission, PermissionResponse)
  }

  @ApiOperation({ summary: 'All permissions' })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found records.',
      type: PermissionResponse,
      isArray: true
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Get()
  async getAll(): Promise<PermissionResponse[]> {
    const permissions = await this.rbacManager.getAllPermissions();
    
    return permissions.map((permission: Permission) => this.mapper.toResponse(permission));
  }

	@ApiOperation({ summary: 'Create new permission' })
    @ApiCreatedResponse({
      description: 'The permission has been successfully created.',
      type: PermissionResponse
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong',
    })
  @Post()
  async createRole(@Body() createPermissionDto: CreatePermissionRequest) {
    const addedPermission = await this.rbacManager.addPermission(
      this.mapper.toPersistence(createPermissionDto)
    );

    return this.mapper.toResponse(addedPermission);
  }

	@ApiOperation({ summary: 'Update permission' })
    @ApiAcceptedResponse({
      description: 'Permission has been successfully updated.',
      type: PermissionResponse,
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
  async updateRole(@Param('name') name: string, @Body() updatePermissionDto: UpdatePermissionRequest) {
    const updatedPermission = await this.rbacManager.updatePermission(
      name, this.mapper.toPersistence(updatePermissionDto)
    );

    return this.mapper.toResponse(updatedPermission);
  }

  @ApiOperation({ summary: 'Delete permission' })
    @ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: 'Permission has been successfully deleted',
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Permission not found',
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Delete(':name')
  async remove(@Param('name') name: string): Promise<void> {
    await this.rbacManager.removePermission(name);
  }
}
