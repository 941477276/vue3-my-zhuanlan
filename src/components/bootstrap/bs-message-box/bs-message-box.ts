import {
  ref,
  createVNode,
  render,
  isVNode,
  VNode,
  AppContext
} from 'vue';
import BsMessageBox from './BsMessageBox.vue';
import {
  StringKeyObject
} from '@/ts-tokens/bootstrap';
import {
  MessageBox,
  MessageBoxFn,
  supportMessageBoxTypes
} from '@/ts-tokens/bootstrap/message';
import { useZIndex } from '@/hooks/useZIndex';
import { useGetContentInfo } from '@/hooks/useGetContentInfo';

type MessageQueueItem = {
  id?: string;
  vm: VNode;
}

// message-box计数
let messageBoxCount = 0;
let messageBoxInstanceQueue: MessageQueueItem[] = [];

const messageBox:MessageBoxFn & Partial<MessageBox> = function (options = {} as any): string {
  let type = 'info';
  let id: string;
  let icon = '';
  let title = '';
  let context = null;
  // 重新组装组件的props
  let messageBoxProps: StringKeyObject = {};
  let { text, slotContent } = useGetContentInfo(options);
  // text, slotContent这2个都没有，则说明传递的options为一个普通的对象
  if (!text && !slotContent) {
    let contentInfo = useGetContentInfo(options.message);
    text = contentInfo.text;
    slotContent = contentInfo.slotContent;
    id = options.id || `bs-message-box_${++messageBoxCount}`;
    title = options.title;
    messageBoxProps = {
      ...options
    };
    icon = options.icon;
    context = options.appContext || null;
    if (options.type) {
      type = options.type;
    }
  } else {
    id = `bs-message-box_${++messageBoxCount}`;
    messageBoxProps = {};
  }
  if (!slotContent) {
    (slotContent as any) = {};
  }
  let { nextZIndex } = useZIndex();

  /* if (isVNode(options) || typeof options !== 'object' || options === null) {
    messageBoxProps = {};
  } else {
    messageBoxProps = {
      ...options
    };
    icon = options.icon;
    context = options.appContext || null;
  } */
  if (!messageBoxProps.zIndex) {
    messageBoxProps.zIndex = nextZIndex();
  }
  if (isVNode(icon) || typeof icon === 'function') {
    (slotContent as any).icon = () => icon;
  }
  if (isVNode(title) || typeof title === 'function') {
    console.log('title isVnode', title);
    (slotContent as any).title = () => title;
  }
  console.log('slotContent', slotContent);

  delete messageBoxProps.id;
  delete messageBoxProps.message;
  delete messageBoxProps.icon;
  delete messageBoxProps.type;

  // 创建包裹容器，因为render函数在渲染至同一dom节点时只能渲染一个vnode，渲染多个的话后面的会将前面的覆盖
  let container = document.createElement('div');
  container.className = 'bs-message-box-wrapper';
  container.setAttribute('data-container-for', id);

  let vm = createVNode(BsMessageBox, {
    ...messageBoxProps,
    type,
    id,
    message: text,
    icon: typeof icon !== 'object' ? icon : '',
    title: typeof title !== 'object' ? title : '',
    onHide () {
      console.log('隐藏了');
      render(null, container);
      setTimeout(function () {
        // 移除container
        document.body.removeChild(container);
        (container as any) = (vm as any) = null;
        // 移除缓存
        let index = messageBoxInstanceQueue.findIndex(item => {
          return item.id === id;
        });
        if (index > -1) {
          messageBoxInstanceQueue.splice(index, 1);
        }
      }, 0);
    }
  }, slotContent);
  vm.appContext = context;

  console.log('vm', vm);
  document.body.appendChild(container);
  render(vm, container);

  messageBoxInstanceQueue.push({
    id,
    vm
  });

  return id;
};

// 生成快速创建message-box的方法
supportMessageBoxTypes.forEach(typeName => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  messageBox[typeName] = function (optionsOrMessage, context) {
    let options: any = {
      type: typeName
    };
    if (optionsOrMessage && (isVNode(optionsOrMessage) || typeof optionsOrMessage !== 'object')) {
      options.message = optionsOrMessage;
      options.appContext = context;
    } else {
      options = {
        ...optionsOrMessage,
        type: typeName
      };
    }
    return messageBox(options);
  };
});

/**
 * 关闭所有消息
 */
export function closeAllMessageBox (): void {
  for (let i = messageBoxInstanceQueue.length - 1; i >= 0; i--) {
    (messageBoxInstanceQueue[i].vm.component?.proxy as any).hide();
  }
};

/**
 * 消息关闭后的处理
 * @param id 消息id
 * @param userOnClose 使用者传递的onClose函数
 */
export function closeMessageBox (id: string): void {
  let index = messageBoxInstanceQueue.findIndex(item => item.id === id);
  if (index == -1) {
    return;
  }
  let deletedItem: MessageQueueItem = messageBoxInstanceQueue[index];

  try {
    (deletedItem.vm.component?.proxy as any).hide();
  } catch (e) {
    console.error(e);
  }
};

export {
  messageBox as BsMessageBox
};
