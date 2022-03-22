import { ValidateFieldsError } from 'async-validator';
import { ComponentInternalInstance, Ref, InjectionKey, Prop } from 'vue';

// 校验状态
export type ValidateStatus = 'validating' | 'success' | 'error' | '';

export type FormItemValidateCallback = (errorMsg: string, invalidFields?: ValidateFieldsError) => void;

export type SetValidateStatusContext = {
  setValidateStatus: (status: ValidateStatus) => void;
  [propName: string]: any; // 支持其他任意属性
};

type ValidateCallback = (valid:boolean) => void;
export interface FormContext {
  props: any,
  addChildComponentContext: (context: any) => void;
  removeChildComponentContext: (context: any) => void;
  validate: (callback?: ValidateCallback) => any;
  validateFields: (fieldPropNames: string|string[], callback?: ValidateCallback) => any;
  resetFields(): void;
  clearValidate: (fieldPropNames: string|string[]) => void
}

export interface FormItemContext {
  $el: HTMLElement|undefined;
  validStatus: ValidateStatus;
  validate: (trigger: string, callback?: FormItemValidateCallback) => void;
  clearValidate(): void;
  resetField(): void;
  addChildComponentContext: (context: SetValidateStatusContext) => void;
  removeChildComponentContext: (context: SetValidateStatusContext) => void;
};

// 子孙组件获取<bs-form>组件provide传递下去的值的key
export const formContextKey: InjectionKey<FormContext> = Symbol('formContextKey');
// 子孙组件获取<bs-form-item>组件provide传递下去的值的key
export const formItemContextKey: InjectionKey<FormItemContext> = Symbol('formItemContextKey');
