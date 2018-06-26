<<深入浅出React和Redux(实战)>>
书中例子学习
todos应用实例
redux实例

界面:单个界面
界面分成3个部分:
  上部:  增加todo
  中部:  todo列表, 包含 点击完成, 点击删除 这2个操作
  底部: 过滤操作: 全部, 活动的, 已完成

功能模块2个模块:
    todos : 增加/完成/删除
    filter : 不同的选择来过滤待办事项

单向数据流: FLUX

Action ->  Dispatcher -> Store -> View
   ^                                |
   |_________________________________

角色:

```
    Action:      事件对象, 多个
    Store:       存储和处理数据相关逻辑, 通过观察者模式来通知View数据的改变 , 多个
    Dispatcher:  分发,建立Action和Store之间的关联,   一个
    View:        通过事件创建Action,然后由Dispather来分发
```

安装Flux:

```
    npm install --save flux
```

创建Dispatcher:

```
    import {Dispatcher} from 'flux';
    export default new Dispatcher();
```