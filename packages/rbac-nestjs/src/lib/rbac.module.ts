import { DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { IRuleInterface, Manager } from '@owl/rbac-manager';
import { RbacRoleController } from './rbac-role.controller';
import { RegistryServiceModule } from '@owl/server-registry-service';
import { RbacPermissionController } from './rbac-permission.controller';

export interface RbacModuleOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>,
  providers?: Provider[],
  rbacManagerProvider: Provider<Manager>,
  rules?: Record<string, Type<IRuleInterface>>,
  global?: boolean
}

export class RbacModule {
  static forFeature(opts: RbacModuleOpts): DynamicModule {
    const { imports = [], providers = [], rules = {}, rbacManagerProvider, global = true } = opts;

    return {
      module: RbacModule,
      imports: [
        ...imports,
        ConfigModule,
        RegistryServiceModule.forFeature<IRuleInterface>({
          name: 'SERVICE_REGISTRY_RULES_NAME',
          services: rules
        })
      ],
      providers: [...providers, rbacManagerProvider],
      exports: [...imports, RbacModule, ConfigModule, rbacManagerProvider],
      controllers: [RbacRoleController, RbacPermissionController],
      global
    }
  }
}