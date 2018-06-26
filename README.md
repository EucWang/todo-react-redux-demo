# <<深入浅出React和Redux(实战)>>书中例子学习

todos应用实例
redux实例

### 界面:单个界面
界面分成3个部分:
  上部:  增加todo
  中部:  todo列表, 包含 点击完成, 点击删除 这2个操作
  底部: 过滤操作: 全部, 活动的, 已完成

### 功能模块2个模块:
    todos : 增加/完成/删除
    filter : 不同的选择来过滤待办事项

### 单向数据流: FLUX
```
Action ->  Dispatcher -> Store -> View
  ^                                  |
  |__________________________________
```

角色:

```
    Action:      事件对象, 多个
    Store:       存储和处理数据相关逻辑, 通过观察者模式来通知View数据的改变 , 多个
    Dispatcher:  分发,建立Action和Store之间的关联,   一个
    View:        通过事件创建Action,然后由Dispather来分发
```

### 回顾使用Flux:
#### 1. 安装Flux:

```
    npm install --save flux
```

#### 2.创建Dispatcher:

```
    import {Dispatcher} from 'flux';
    export default new Dispatcher();
```

#### 3. action
action类似于DOM API中的事件, 而且是纯粹的数据对象,
action对象必须有一个type字段表明action对象的类型

这里的Actions.js中获得的并不是action对象本身,而是能够产生并派发action对象的函数.

```
//ActionTypes.js
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';

//Actions.js
import * as ActionTypes from './ActionTypes.js';
import AppDispatcher from './AppDispatcher.js';

export const increment = (counterCaption) =>{
    AppDispatcher.dispatch({
        type: ActionTypes.INCREMENT,
        counterCaption: counterCaption
    });
}

export const decrement = (counterCaption) =>{
    AppDispatcher.dispatch({
        type: ActionTypes.DECREMENT,
        counterCaption: counterCaption
    });
}

```

#### 4. store
##### 4.1 第一个store: CounterStore
当Store数据发生变化时,需要通知View做必要的响应,这里让Store扩展了EventEmitter.prototype,等于让Store成了**EventEmitter**对象, 一个EventEmitter实例对象支持的函数有:

* emit函数: 可以广播特定事件,第一个参数是字符串类型事件名称
* on函数: 可以增加一个监听,挂在这个EventEmitter对象特定事件上
* removeListener函数: 删除监听

```
//CounterStore.js
import AppDispatcher from './AppDispatcher.js';
const CHANGE_EVENT = 'changed';
//数据
const counterValues = {
    'First':0,
    'Second':10,
    'Third':30
};

//Store对象
const CounterStore = Object.assign({}, EventEmitter.prototype,
    {
        getCounterValues: function(){return counterValues;},//通过Store获取数据
        emitChange: function(){this.emit(CHANGE_EVENT);},
        addListener: function(){this.on(CHANGE_EVENT, callback);} //在View中的装载方法中调用
        removeListener: function(){this.removeListener(CHNAGE_EVENT, callback);} //在View的卸载方法中调用
    }
);

// 将Store对象注册到Dispatcher
CounterStore.dispatchToken = AppDispatcher.register(
    (action) =>{
        if(action.type === ActionTypes.INCREMENT) {
            counterValues[action.counterCaption] ++; //改变数据
            CounterStore.emitChange();               //改变数据发出通知
        } else if(action.type === ActionTypes.DECREMENT) {
            counterValues[action.counterCaption] --; //改变数据
            CounterStore.emitChange();               //改变数据发出通知
        }
    }
);
```

##### 4.2 第二个Store: SummaryStore
SummaryStore不需要存储数据,直接从CounterStore里获取数据并计算得到结果

两个Store之间如果存在因果关系, 需要通过***waitFor***函数来保证执行的先后顺序.
waitFor函数接受的参数是一个数组.
```
//SummaryStore.js
const CHANGE_EVENT = 'changed';
function computerSummary(counterValues) {
    let summary = 0;
    for(const key in counterValues) {
        if(counterValues.hasOwnProperty(key)) {
            summary += counterValues[key];
        }
    }
    return summary;
}

const SummaryStore = Object.assign({}, EventEmitter.prototype, {
        getSummary : function(){
            return computeSummary(CounterStore.getCounterValues());
        },
    }
);

//注册SummaryStore到Dispatcher上
SummaryStore.dispatchToken = AppDispatcher.register(
    (action) => {
        if((action.type === ActionTypes.INCRMENT) ||
           (action.type === ActionTypes.DECREMENT)) {
                AppDispatcher.waitFor([CounterStore.dispatchToken]); //等待
                SummaryStore.emitChange();                        //发出更新通知
        }
    }
)
```

#### 5. View
View需要做的事情有:

1. View在创建时读取Store数据来初始化组件内部状态
2. Store上数据改变时, 组件同步更新state
3. View如果要改变Store中的数据,需要且只能派发action

```
//Counter.js
constructor(props){
    super(props);
    //通过Store来初始化state数据
    this.state = {  
        counter : CounterStore.getCounterValues()[props.caption]
    };
}

//添加和移除对View的事件通知
componentDidMount(){    CounterStore.addListener(this.onChange); }
componentWillUnmount(){    CounterStore.removeListener(this.onChange); }
onChange(){
    this.setState({count:CounterStore.getCounterValues()[this.props.caption]});
}

//通过Action->Dispatcher发出事件,
const onClickIncrementBtn = ()=>{Actions.increment(this.props.caption);}
const onClickDecrementBtn = ()=>{Actions.decrement(this.props.caption);}

render(){
    const {caption} = this.props;
    return (
        <div>
            <button onClick={this.onClickIncrementBtn}>+</button>
            <button onClick={this.onClickDecrement}>-</button>
            <span>{caption} count: {this.state.count}</span>
        </div>
    )
}
```

### 使用Redux

#### 1. Redux基本原则:

Redux基于Flux, 并强调了三个基本原则:

1. 唯一数据源 

    ***只有一个Store***

2. 保持状态只读 

    ***Store数据不能修改, 只能生成新的覆盖旧的***

3. 数据改变只能通过纯函数完成 

    ***reducer(state, action)***会返回一个新的数据对象给Redux框架来更新Store中的数据, reducer为store服务

#### 2. action
```
//actions.js
import * as ActionTypes from './ActionTypes.js';
//直接生成Action对象,不同于Flux,Flux是得到Dispatcher分发的函数
export const increment = (counterCaption)=>({
    type: ActionTypes.INCREMENT,
    counterCaption:counterCaption
    });

export const decrement = (counterCaption)=>({
    type: ActionTypes.DECREMENT,
    counterCaption:counterCaption
    })
```

#### 3. reducer

redux把存储state的工作抽取出来交给Redux框架本身,让reducer只用关心如何更新state,而不用管state怎么存.
```
//Reducer.js
import * as ActionTypes from './ActionTypes.js';

//根据不同的action.type生成不同的state并返回
export default (state. action) => {
    const {counterCaption} = action;
    switch(action.type) {
        case ActionTypes.INCREMENT:
            return {
                ...state, [counterCaption]:state[counterCaption] + 1
            };
        case ActionTypes.DECREMENT:
            return {
                ...state, [counterCaption]:state[counterCaption] - 1
            };
        default:
            return state;
    }
}
```

#### 4. store
```
//Store.js
import {createStore} from 'redux';
import reducer from './Reducer.js';
const initValues = {
    'First':0,
    'Second':10,
    'Third':20
};
//通过函数createStore生成唯一的store
const store = createStore(reducer, initValues);
export default store;
```


#### 5. view
Redux中的View和Flux以及普通的View很有一些不同

```
import store from './Store.js';

class Counter extends Component {
    constructor(props){
        super(props);
        this.state = this.getOwnState();
    }
    //注册和注销 store数据改变的通知
    componentDidMount(){store.subscribe(this.onChange);}
    componentWillUnmount(){store.unsubscribe(this.onChange);}
    onChange(){this.setState(this.getOwnState());}
    
    getOwnState(){return {value: store.getState()[this.props.caption]};}
    //调用store.dispatch()来发出action
    onIncre(){store.dispatch(Actions.increment(this.props.caption));}
    onDecre(){store.dispatch(Actions.decrement(this.props.caption));}

    render(){
        const value = this.state.value;
        const {caption} = this.props;
        return (
            <div>
                <button onClick={this.onIncre}>+</button>
                <button onClick={this.onDecre}>-</button>
                <span>{caption} count: {value}</span>
            </div>
        );
    }
}
```

### 6. Redux对View的封装(容器组件和傻瓜组件)
#### 6.1 Redux的Provider提供的全局context

1. Provider作为顶层组件,
2. Provider组件持有store, 
3. Provider只是把渲染工作完全交给子组件,
4. Provider只是提供context, 让整个应用中所有组件有可以访问context

```
import registerServiceWorker from './registerServiceWorker';
import store from './Store.js';
import {Provider} from 'react-redux';

ReactDOM.render((<Provider store={store}>
                    <ControlPanel />
                </Provider>),
        document.getElementById('root'));
registerServiceWorker();
```

在ControlPanel中就可以直接访问这个context对象了
```
//constructor(props, context){  //构造函数需要中接受context参数
//    super(props, context);
//}
constructor(){super(...arguments);} //这样写,就不用考虑参数增加的麻烦了
getOwnState(){
    return {
        //通过context可以拿到store,从而全局就可以直接拿去store,而不用去import了
        value: this.context.store.getState()[this.props.caption]
    };
}
...
```


#### 6.2 傻瓜组件
1. 拆分View为容器组件和傻瓜组件, 是react的一种模式, 和redux无关
2. 傻瓜组件只需要根据props来渲染,不需要state
3. 容器组件的模式基本固定, 根据store的数据来获取相应的数据,然后通过props传递给傻瓜组件,所有这里可以抽象容器组件

1.一个傻瓜组件
```
//Counter.js
const Counter  = ({caption, onIncre, onDecre, value})=>(
    <div>
        <button onClick={onIncre}>+</button>
        <button onClick={onDecre}>-</button>
        <span>{caption} count: {value}</span>
    </div>
)
```

#### 6.3 使用connect()函数产生容器组件

容器组件的2个工作:

1. 把Store上的数据转换成内层傻瓜组件需要的props(这是对傻瓜组件的输入)
2. 把内层傻瓜组件中的用户动作转换成派送给Store的动作(这是傻瓜组件的输出)

根据如上套路,***connect***是react-redux提供的一个方法, 这个方法接受2个参数:

* mapStateToProps:     完成store上的数据到组件的props的一个映射
* mapDispatchToProps:  完成组件中用户的动作到store中派送动作的映射

如下,会执行2次函数调用,connect()函数执行之后返回一个新的函数,新的函数接受参数Counter组件作为参数,再次执行之后返回一个容器组件

```
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```